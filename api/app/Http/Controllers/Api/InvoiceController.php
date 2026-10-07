<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Mail\InvoiceSentMail;
use App\Models\Invoice;
use App\Models\Project;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

class InvoiceController extends Controller
{
    public function index(Project $project)
    {
        $this->authorize('view', $project);

        return InvoiceResource::collection($project->invoices()->latest()->paginate(15));
    }

    public function store(StoreInvoiceRequest $request, Project $project)
    {
        $invoice = $project->invoices()->create($request->validated());

        return new InvoiceResource($invoice);
    }

    public function show(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        return new InvoiceResource($invoice->load('lineItems'));
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice)
    {
        $wasAlreadySent = $invoice->status === 'sent';

        $invoice->update($request->validated());

        if ($invoice->status === 'sent' && ! $wasAlreadySent) {
            $invoice->load('project.client');
            Mail::to($invoice->project->client->email)->queue(new InvoiceSentMail($invoice));
        }

        return new InvoiceResource($invoice);
    }

    public function destroy(Invoice $invoice)
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return response()->noContent();
    }

    public function paymentLink(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        $url = URL::signedRoute('invoices.pay.show', ['invoice' => $invoice->id]);

        return response()->json(['url' => $url]);
    }
}
