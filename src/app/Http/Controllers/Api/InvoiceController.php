<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Models\Project;

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
        $invoice->update($request->validated());

        return new InvoiceResource($invoice);
    }

    public function destroy(Invoice $invoice)
    {
        $this->authorize('delete', $invoice);

        $invoice->delete();

        return response()->noContent();
    }
}
