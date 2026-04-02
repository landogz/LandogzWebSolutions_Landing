<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompanyValueRequest;
use App\Http\Requests\Admin\UpdateCompanyValueRequest;
use App\Http\Resources\CompanyValueResource;
use App\Models\CompanyValue;
use Illuminate\Http\JsonResponse;

class CompanyValueAdminController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = CompanyValue::query()->orderBy('sort_order')->get();

        return $this->success(CompanyValueResource::collection($items));
    }

    public function store(StoreCompanyValueRequest $request): JsonResponse
    {
        $row = CompanyValue::query()->create($request->validated());

        return $this->success(new CompanyValueResource($row), 'Value created.', 201);
    }

    public function show(CompanyValue $companyValue): JsonResponse
    {
        return $this->success(new CompanyValueResource($companyValue));
    }

    public function update(UpdateCompanyValueRequest $request, CompanyValue $companyValue): JsonResponse
    {
        $companyValue->update($request->validated());

        return $this->success(new CompanyValueResource($companyValue->fresh()), 'Value updated.');
    }

    public function destroy(CompanyValue $companyValue): JsonResponse
    {
        $companyValue->delete();

        return $this->success(null, 'Value deleted.');
    }
}
