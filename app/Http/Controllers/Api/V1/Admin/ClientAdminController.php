<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreClientRequest;
use App\Http\Requests\Admin\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;

class ClientAdminController extends Controller
{
    use ApiResponses;

    public function __construct(protected ImageOptimizationService $images) {}

    public function index(): JsonResponse
    {
        $items = Client::query()->orderBy('sort_order')->get();

        return $this->success(ClientResource::collection($items));
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('logo')) {
            $data['logo_path'] = $this->images->storeAndOptimize($request->file('logo'), 'clients/logos', 800);
        }
        unset($data['logo']);
        $row = Client::query()->create($data);

        return $this->success(new ClientResource($row), 'Client created.', 201);
    }

    public function show(Client $client): JsonResponse
    {
        return $this->success(new ClientResource($client));
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('logo')) {
            $this->images->delete($client->logo_path);
            $data['logo_path'] = $this->images->storeAndOptimize($request->file('logo'), 'clients/logos', 800);
        }
        unset($data['logo']);
        $client->update($data);

        return $this->success(new ClientResource($client->fresh()), 'Client updated.');
    }

    public function destroy(Client $client): JsonResponse
    {
        $this->images->delete($client->logo_path);
        $client->delete();

        return $this->success(null, 'Client deleted.');
    }
}
