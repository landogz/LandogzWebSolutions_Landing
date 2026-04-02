<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProjectRequest;
use App\Http\Requests\Admin\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Repositories\ProjectRepository;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectAdminController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected ProjectRepository $projectRepository,
        protected ImageOptimizationService $images
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->projectRepository->paginateAdmin(
            (int) $request->query('per_page', 15),
            $request->query('search'),
            $request->query('category_id') ? (int) $request->query('category_id') : null
        );

        return $this->success([
            'items' => ProjectResource::collection($paginator->items()),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        $data['slug'] = $this->uniqueSlug($data['slug']);

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail_path'] = $this->images->storeAndOptimize($request->file('thumbnail'), 'projects/thumbnails');
        }

        $gallery = [];
        if ($request->hasFile('gallery')) {
            $gallery = $this->images->storeGallery($request->file('gallery') ?? [], 'projects/gallery');
        }
        $data['gallery_paths'] = array_merge($data['gallery_paths'] ?? [], $gallery);

        unset($data['thumbnail'], $data['gallery']);
        $project = Project::query()->create($data);

        return $this->success(new ProjectResource($project->load('category')), 'Project created.', 201);
    }

    public function show(Project $project): JsonResponse
    {
        return $this->success(new ProjectResource($project->load('category')));
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $data = $request->validated();

        if (! empty($data['title']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        if (! empty($data['slug']) && $data['slug'] !== $project->slug) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $project->id);
        }

        if ($request->hasFile('thumbnail')) {
            $this->images->delete($project->thumbnail_path);
            $data['thumbnail_path'] = $this->images->storeAndOptimize($request->file('thumbnail'), 'projects/thumbnails');
        }

        if ($request->hasFile('gallery')) {
            $newPaths = $this->images->storeGallery($request->file('gallery') ?? [], 'projects/gallery');
            $existing = $project->gallery_paths ?? [];
            $data['gallery_paths'] = array_merge($existing, $newPaths);
        }

        unset($data['thumbnail'], $data['gallery']);
        $project->update($data);

        return $this->success(new ProjectResource($project->fresh()->load('category')), 'Project updated.');
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->images->delete($project->thumbnail_path);
        foreach ($project->gallery_paths ?? [] as $path) {
            $this->images->delete($path);
        }
        $project->delete();

        return $this->success(null, 'Project deleted.');
    }

    public function removeGalleryImage(Request $request, Project $project): JsonResponse
    {
        $request->validate(['path' => ['required', 'string']]);
        $path = $request->input('path') ?? $request->query('path');
        $paths = collect($project->gallery_paths ?? []);
        if ($path && $paths->contains($path)) {
            $this->images->delete($path);
            $project->update(['gallery_paths' => $paths->filter(fn ($p) => $p !== $path)->values()->all()]);
        }

        return $this->success(new ProjectResource($project->fresh()->load('category')), 'Image removed.');
    }

    protected function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug;
        $i = 1;
        while (Project::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }
}
