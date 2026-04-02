<?php

namespace App\Repositories;

use App\Models\TeamMember;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class TeamMemberRepository
{
    public function __construct(protected TeamMember $model) {}

    public function paginateAdmin(int $perPage, ?string $search): LengthAwarePaginator
    {
        $q = $this->model->newQuery();

        if ($search) {
            $q->where(function ($query) use ($search) {
                $query->where('name', 'like', '%'.$search.'%')
                    ->orWhere('position', 'like', '%'.$search.'%');
            });
        }

        return $q->orderBy('sort_order')->orderBy('name')->paginate($perPage);
    }

    public function orderedPublic(): Collection
    {
        return $this->model->newQuery()->orderBy('sort_order')->orderBy('name')->get();
    }
}
