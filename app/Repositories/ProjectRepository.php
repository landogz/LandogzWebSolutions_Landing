<?php

namespace App\Repositories;

use App\Models\Project;
use App\Models\ProjectCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProjectRepository
{
    public function __construct(protected Project $model) {}

    public function paginateAdmin(int $perPage, ?string $search, ?int $categoryId): LengthAwarePaginator
    {
        $q = $this->model->newQuery()->with('category');

        if ($search) {
            $q->where(function ($query) use ($search) {
                $query->where('title', 'like', '%'.$search.'%')
                    ->orWhere('short_description', 'like', '%'.$search.'%');
            });
        }

        if ($categoryId) {
            $q->where('project_category_id', $categoryId);
        }

        return $q->orderByDesc('is_featured')->orderByDesc('id')->paginate($perPage);
    }

    public function publishedForPublic(?string $categorySlug, ?string $tech): Collection
    {
        $q = $this->model->newQuery()
            ->published()
            ->with('category')
            ->orderByDesc('is_featured')
            ->orderByDesc('id');

        if ($categorySlug) {
            $q->whereHas('category', fn ($c) => $c->where('slug', $categorySlug));
        }

        if ($tech) {
            $q->where('tech_stack', 'like', '%"'.$tech.'"%');
        }

        return $q->get();
    }
}
