<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api;
use Razorpay\Api\Errors\SignatureVerificationError;

class RazorpayWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $webhookSecret = config('services.razorpay.webhook_secret');
        $signature = $request->header('X-Razorpay-Signature');

        if (! $webhookSecret || ! $signature) {
            return response()->json(['message' => 'Webhook not configured.'], 400);
        }

        try {
            $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
            $api->utility->verifyWebhookSignature(
                $request->getContent(),
                $signature,
                $webhookSecret,
            );
        } catch (SignatureVerificationError $e) {
            Log::warning('Razorpay webhook signature verification failed', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $payload = $request->json()->all();

        if ($payload['event'] === 'payment.captured') {
            $orderId = $payload['payload']['payment']['entity']['order_id'] ?? null;
            $paymentId = $payload['payload']['payment']['entity']['id'] ?? null;

            $invoice = Invoice::where('razorpay_order_id', $orderId)->first();

            // Idempotent: only update if not already marked paid, since this
            // webhook can legitimately fire more than once for the same event.
            if ($invoice && $invoice->status !== 'paid') {
                $invoice->update([
                    'status' => 'paid',
                    'razorpay_payment_id' => $paymentId,
                    'paid_at' => now(),
                ]);
            }
        }

        return response()->json(['message' => 'Webhook handled.']);
    }
}
