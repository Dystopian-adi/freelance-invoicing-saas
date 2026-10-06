<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class PaymentController extends Controller
{
    protected function razorpay(): Api
    {
        return new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret'),
        );
    }

    /**
     * Public: show invoice details for the payment page.
     * Protected by Laravel's signed-URL middleware, not auth.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load('lineItems', 'project.client');

        return response()->json([
            'invoice_number' => $invoice->invoice_number,
            'total' => $invoice->total,
            'status' => $invoice->status,
            'due_date' => $invoice->due_date,
            'client_name' => $invoice->project->client->name,
            'line_items' => $invoice->lineItems,
        ]);
    }

    /**
     * Public: create a Razorpay order for this invoice.
     */
    public function createOrder(Invoice $invoice)
    {
        if ($invoice->status === 'paid') {
            return response()->json(['message' => 'Invoice already paid.'], 422);
        }

        // Razorpay amounts are in the smallest currency unit (paise for INR)
        $amountInPaise = (int) round($invoice->total * 100);

        $order = $this->razorpay()->order->create([
            'receipt' => $invoice->invoice_number,
            'amount' => $amountInPaise,
            'currency' => 'INR',
            'notes' => [
                'invoice_id' => $invoice->id,
            ],
        ]);

        $invoice->update(['razorpay_order_id' => $order['id']]);

        return response()->json([
            'order_id' => $order['id'],
            'amount' => $amountInPaise,
            'currency' => 'INR',
            'key' => config('services.razorpay.key'),
        ]);
    }

    /**
     * Public: verify the payment signature Razorpay's checkout returned,
     * and mark the invoice paid only if it's genuinely valid.
     */
    public function verify(Request $request, Invoice $invoice)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        try {
            $this->razorpay()->utility->verifyPaymentSignature([
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature,
            ]);
        } catch (SignatureVerificationError $e) {
            Log::warning('Razorpay signature verification failed', [
                'invoice_id' => $invoice->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Payment verification failed.'], 422);
        }

        $invoice->update([
            'status' => 'paid',
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'paid_at' => now(),
        ]);

        return response()->json(['message' => 'Payment verified.', 'invoice' => new InvoiceResource($invoice)]);
    }
}
