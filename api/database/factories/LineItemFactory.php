<?php

namespace Database\Factories;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

class LineItemFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->randomFloat(2, 1, 10);
        $unitPrice = fake()->randomFloat(2, 20, 500);

        return [
            'invoice_id' => Invoice::factory(),
            'description' => fake()->randomElement([
                'Design work',
                'Development hours',
                'Consulting session',
                'Revisions',
                'Project management',
                'Content writing',
            ]),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'subtotal' => round($quantity * $unitPrice, 2),
        ];
    }
}
