<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use Illuminate\Console\Command;

class MarkOverdueInvoices extends Command
{
    protected $signature = 'invoices:mark-overdue';

    protected $description = 'Mark invoices as overdue if their due date has passed and they are not yet paid';

    public function handle(): int
    {
        $count = Invoice::where('due_date', '<', now())
            ->whereNotIn('status', ['paid', 'overdue'])
            ->update(['status' => 'overdue']);

        $this->info("Marked {$count} invoice(s) as overdue.");

        return self::SUCCESS;
    }
}
