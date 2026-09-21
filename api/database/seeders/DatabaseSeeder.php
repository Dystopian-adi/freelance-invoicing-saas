<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\LineItem;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => bcrypt('password'),
        ]);

        Client::factory(5)
            ->for($user)
            ->create()
            ->each(function (Client $client) {
                Project::factory(rand(1, 3))
                    ->for($client)
                    ->create()
                    ->each(function (Project $project) {
                        Invoice::factory(rand(1, 4))
                            ->for($project)
                            ->create()
                            ->each(function (Invoice $invoice) {
                                $lineItems = LineItem::factory(rand(1, 5))
                                    ->for($invoice)
                                    ->create();

                                $invoice->update([
                                    'total' => $lineItems->sum('subtotal'),
                                ]);
                            });
                    });
            });
    }
}
