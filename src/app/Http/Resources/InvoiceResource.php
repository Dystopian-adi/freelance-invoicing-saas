<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'invoice_number' => $this->invoice_number,
            'status' => $this->status,
            'issue_date' => $this->issue_date,
            'due_date' => $this->due_date,
            'total' => $this->total,
            'line_items' => LineItemResource::collection($this->whenLoaded('lineItems')),
            'created_at' => $this->created_at,
        ];
    }
}
