<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; color: #1a2332; font-size: 13px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        h1 { font-size: 22px; margin: 0; }
        .muted { color: #708090; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { text-align: left; border-bottom: 2px solid #1a2332; padding: 8px 4px; font-size: 11px; text-transform: uppercase; color: #708090; }
        td { padding: 8px 4px; border-bottom: 1px solid #e2e8f0; }
        .text-right { text-align: right; }
        .total-row td { border-top: 2px solid #1a2332; border-bottom: none; font-weight: bold; font-size: 16px; padding-top: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>Invoice {{ $invoice->invoice_number }}</h1>
            <p class="muted">Issued {{ $invoice->issue_date->format('d M Y') }} &middot; Due {{ $invoice->due_date->format('d M Y') }}</p>
        </div>
        <div>
            <p><strong>Billed to:</strong><br>{{ $invoice->project->client->name }}</p>
            @if($invoice->project->client->company)
                <p class="muted">{{ $invoice->project->client->company }}</p>
            @endif
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->lineItems as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">Rs. {{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right">Rs. {{ number_format($item->subtotal, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" class="text-right">Total</td>
                <td class="text-right">Rs. {{ number_format($invoice->total, 2) }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
