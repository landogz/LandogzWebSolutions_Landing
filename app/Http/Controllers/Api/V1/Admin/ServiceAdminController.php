<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceRequest;
use App\Http\Requests\Admin\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service as ServiceModel;
use Illuminate\Http\JsonResponse;

class ServiceAdminController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = ServiceModel::query()->orderBy('sort_order')->get();

        return $this->success(ServiceResource::collection($items));
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $row = ServiceModel::query()->create($request->validated());

        return $this->success(new ServiceResource($row), 'Service created.', 201);
    }

    public function show(ServiceModel $service): JsonResponse
    {
        return $this->success(new ServiceResource($service));
    }

    public function update(UpdateServiceRequest $request, ServiceModel $service): JsonResponse
    {
        $service->update($request->validated());

        return $this->success(new ServiceResource($service->fresh()), 'Service updated.');
    }

    public function destroy(ServiceModel $service): JsonResponse
    {
        $service->delete();

        return $this->success(null, 'Service deleted.');
    }
}
