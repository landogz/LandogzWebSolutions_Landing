<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectCategoryRequest;
use App\Http\Requests\Admin\UpdateProjectCategoryRequest;
use App\Http\Resources\ProjectCategoryResource;
use App\Models\ProjectCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProjectCategoryAdminController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = ProjectCategory::query()->orderBy('sort_order')->get();

        return $this->success(ProjectCategoryResource::collection($items));
    }

    public function store(StoreProjectCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $row = ProjectCategory::query()->create($data);

        return $this->success(new ProjectCategoryResource($row), 'Category created.', 201);
    }

    public function show(ProjectCategory $projectCategory): JsonResponse
    {
        return $this->success(new ProjectCategoryResource($projectCategory));
    }

    public function update(UpdateProjectCategoryRequest $request, ProjectCategory $projectCategory): JsonResponse
    {
        $data = $request->validated();
        if (isset($data['name']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        $projectCategory->update($data);

        return $this->success(new ProjectCategoryResource($projectCategory->fresh()), 'Category updated.');
    }

    public function destroy(ProjectCategory $projectCategory): JsonResponse
    {
        $projectCategory->delete();

        return $this->success(null, 'Category deleted.');
    }
}
