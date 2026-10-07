@component('mail::message')
# Invoice {{ $invoice->invoice_number }}

Hi {{ $invoice->project->client->name }},

You have a new invoice from {{ $invoice->project->name }}.

@component('mail::panel')
**Total due:** ₹{{ number_format($invoice->total, 2) }}
**Due date:** {{ $invoice->due_date->format('d M Y') }}
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
