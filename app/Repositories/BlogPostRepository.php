<?php

namespace App\Repositories;

use App\Models\BlogPost;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class BlogPostRepository
{
    public function __construct(protected BlogPost $model) {}

    public function paginateAdmin(int $perPage, ?string $search, ?string $category): LengthAwarePaginator
    {
        $q = $this->model->newQuery();

        if ($search) {
            $q->where(function ($query) use ($search) {
                $query->where('title', 'like', '%'.$search.'%')
                    ->orWhere('excerpt', 'like', '%'.$search.'%');
            });
        }

        if ($category) {
            $q->where('category', $category);
        }

        return $q->orderByDesc('published_at')->orderByDesc('id')->paginate($perPage);
    }

    public function latestPublished(int $limit = 3): Collection
    {
        return $this->model->newQuery()
            ->published()
            ->orderByDesc('published_at')
            ->limit($limit)
            ->get();
    }
}
