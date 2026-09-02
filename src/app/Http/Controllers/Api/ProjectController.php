<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Client;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index(Client $client)
    {
        $this->authorize('view', $client);

        return ProjectResource::collection($client->projects()->latest()->paginate(15));
    }

    public function store(StoreProjectRequest $request, Client $client)
    {
        $project = $client->projects()->create($request->validated());

        return new ProjectResource($project);
    }

    public function show(Project $project)
    {
        $this->authorize('view', $project);

        return new ProjectResource($project->load('invoices'));
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        return new ProjectResource($project);
    }

    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->noContent();
    }
}
