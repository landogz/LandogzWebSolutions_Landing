<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectCategoryResource;
use App\Models\ProjectCategory;
use Illuminate\Http\JsonResponse;

class ProjectCategoriesPublicController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = ProjectCategory::query()->orderBy('sort_order')->get();

        return $this->success(ProjectCategoryResource::collection($items));
    }
}
