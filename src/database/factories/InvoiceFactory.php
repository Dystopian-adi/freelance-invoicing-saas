<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    public function definition(): array
    {
        $issueDate = fake()->dateTimeBetween('-2 months', 'now');

        return [
            'project_id' => Project::factory(),
            'invoice_number' => 'INV-' . fake()->unique()->numerify('#####'),
            'status' => fake()->randomElement(['draft', 'sent', 'paid', 'overdue']),
            'issue_date' => $issueDate,
            'due_date' => (clone $issueDate)->modify('+14 days'),
            'total' => 0, // recalculated after line items are attached
        ];
    }
}
