<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use App\Repositories\BlogPostRepository;
use Illuminate\Http\JsonResponse;

class BlogPublicController extends Controller
{
    use ApiResponses;

    public function __construct(protected BlogPostRepository $blogPostRepository) {}

    public function index(): JsonResponse
    {
        $items = $this->blogPostRepository->latestPublished(12);

        return $this->success(BlogPostResource::collection($items));
    }

    public function show(string $slug): JsonResponse
    {
        $post = BlogPost::query()
            ->published()
            ->where('slug', $slug)
            ->firstOrFail();

        return $this->success(new BlogPostResource($post));
    }
}
