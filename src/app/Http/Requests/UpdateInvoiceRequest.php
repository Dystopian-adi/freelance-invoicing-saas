<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('invoice'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'invoice_number' => 'sometimes|required|string|max:255|unique:invoices,invoice_number,' . $this->route('invoice')?->id,
            'status' => 'sometimes|required|in:draft,sent,paid,overdue',
            'issue_date' => 'sometimes|required|date',
            'due_date' => 'sometimes|required|date|after_or_equal:issue_date',
        ];
    }
}
