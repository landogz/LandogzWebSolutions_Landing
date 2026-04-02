<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBlogPostRequest;
use App\Http\Requests\Admin\UpdateBlogPostRequest;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use App\Repositories\BlogPostRepository;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogPostAdminController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected BlogPostRepository $blogRepo,
        protected ImageOptimizationService $images
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->blogRepo->paginateAdmin(
            (int) $request->query('per_page', 15),
            $request->query('search'),
            $request->query('category')
        );

        return $this->success([
            'items' => BlogPostResource::collection($paginator->items()),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function store(StoreBlogPostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? Str::slug($data['title']);
        $data['slug'] = $this->uniqueSlug($data['slug']);

        if ($request->hasFile('featured_image')) {
            $data['featured_image_path'] = $this->images->storeAndOptimize($request->file('featured_image'), 'blog/featured');
        }
        unset($data['featured_image']);

        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        $post = BlogPost::query()->create($data);

        return $this->success(new BlogPostResource($post), 'Post created.', 201);
    }

    public function show(BlogPost $blogPost): JsonResponse
    {
        return $this->success(new BlogPostResource($blogPost));
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blogPost): JsonResponse
    {
        $data = $request->validated();

        if (! empty($data['title']) && empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        if (! empty($data['slug']) && $data['slug'] !== $blogPost->slug) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $blogPost->id);
        }

        if ($request->hasFile('featured_image')) {
            $this->images->delete($blogPost->featured_image_path);
            $data['featured_image_path'] = $this->images->storeAndOptimize($request->file('featured_image'), 'blog/featured');
        }
        unset($data['featured_image']);

        if (($data['status'] ?? $blogPost->status) === 'published' && empty($data['published_at']) && ! $blogPost->published_at) {
            $data['published_at'] = now();
        }

        $blogPost->update($data);

        return $this->success(new BlogPostResource($blogPost->fresh()), 'Post updated.');
    }

    public function destroy(BlogPost $blogPost): JsonResponse
    {
        $this->images->delete($blogPost->featured_image_path);
        $blogPost->delete();

        return $this->success(null, 'Post deleted.');
    }

    protected function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = $slug;
        $i = 1;
        while (BlogPost::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }
}
