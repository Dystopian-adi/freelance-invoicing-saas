<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LineItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'description',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    protected static function booted(): void
    {
        static::saving(function (LineItem $lineItem) {
            $lineItem->subtotal = round($lineItem->quantity * $lineItem->unit_price, 2);
        });

        static::saved(fn(LineItem $lineItem) => $lineItem->recalculateInvoiceTotal());
        static::deleted(fn(LineItem $lineItem) => $lineItem->recalculateInvoiceTotal());
    }

    protected function recalculateInvoiceTotal(): void
    {
        $this->invoice->update([
            'total' => $this->invoice->lineItems()->sum('subtotal'),
        ]);
    }
}
