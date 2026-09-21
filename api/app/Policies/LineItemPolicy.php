<?php

namespace App\Policies;

use App\Models\LineItem;
use App\Models\User;

class LineItemPolicy
{
    public function view(User $user, LineItem $lineItem): bool
    {
        return $user->id === $lineItem->invoice->project->client->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, LineItem $lineItem): bool
    {
        return $user->id === $lineItem->invoice->project->client->user_id;
    }

    public function delete(User $user, LineItem $lineItem): bool
    {
        return $user->id === $lineItem->invoice->project->client->user_id;
    }
}
