<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $clients = $request->user()->clients()->latest()->paginate(15);

        return ClientResource::collection($clients);
    }

    public function store(StoreClientRequest $request)
    {
        $client = $request->user()->clients()->create($request->validated());

        return new ClientResource($client);
    }

    public function show(Client $client)
    {
        $this->authorize('view', $client);

        return new ClientResource($client->load('projects'));
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $client->update($request->validated());

        return new ClientResource($client);
    }

    public function destroy(Client $client)
    {
        $this->authorize('delete', $client);

        $client->delete();

        return response()->noContent();
    }
}
