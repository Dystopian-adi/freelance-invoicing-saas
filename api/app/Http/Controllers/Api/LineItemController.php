<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLineItemRequest;
use App\Http\Requests\UpdateLineItemRequest;
use App\Http\Resources\LineItemResource;
use App\Models\Invoice;
use App\Models\LineItem;

class LineItemController extends Controller
{
    public function index(Invoice $invoice)
    {
        $this->authorize('view', $invoice);

        return LineItemResource::collection($invoice->lineItems);
    }

    public function store(StoreLineItemRequest $request, Invoice $invoice)
    {
        $lineItem = $invoice->lineItems()->create($request->validated());

        return new LineItemResource($lineItem);
    }

    public function show(LineItem $lineItem)
    {
        $this->authorize('view', $lineItem);

        return new LineItemResource($lineItem);
    }

    public function update(UpdateLineItemRequest $request, LineItem $lineItem)
    {
        $lineItem->update($request->validated());

        return new LineItemResource($lineItem);
    }

    public function destroy(LineItem $lineItem)
    {
        $this->authorize('delete', $lineItem);

        $lineItem->delete();

        return response()->noContent();
    }
}
