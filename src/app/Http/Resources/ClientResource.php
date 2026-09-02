<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'company' => $this->company,
            'phone' => $this->phone,
            'address' => $this->address,
            'projects' => ProjectResource::collection($this->whenLoaded('projects')),
            'created_at' => $this->created_at,
        ];
    }
}
