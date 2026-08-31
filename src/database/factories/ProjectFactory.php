<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'name' => fake()->catchPhrase(),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['active', 'completed', 'archived']),
            'rate_type' => fake()->randomElement(['hourly', 'fixed']),
            'rate' => fake()->randomFloat(2, 50, 15000),
        ];
    }
}
