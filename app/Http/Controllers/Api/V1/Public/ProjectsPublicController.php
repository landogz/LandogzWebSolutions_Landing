<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Repositories\ProjectRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectsPublicController extends Controller
{
    use ApiResponses;

    public function __construct(protected ProjectRepository $projectRepository) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->projectRepository->publishedForPublic(
            $request->query('category'),
            $request->query('tech')
        );

        return $this->success(ProjectResource::collection($items));
    }

    public function show(string $slug): JsonResponse
    {
        $project = Project::query()
            ->published()
            ->where('slug', $slug)
            ->with('category')
            ->firstOrFail();

        return $this->success(new ProjectResource($project));
    }
}
