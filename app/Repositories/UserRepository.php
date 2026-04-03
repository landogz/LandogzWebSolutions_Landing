<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserRepository
{
    public function paginate(?string $search, int $perPage): LengthAwarePaginator
    {
        $q = User::query()->orderBy('name');

        if ($search) {
            $s = '%'.$search.'%';
            $q->where(function ($w) use ($s) {
                $w->where('name', 'like', $s)->orWhere('email', 'like', $s);
            });
        }

        return $q->paginate($perPage);
    }

    public function countByRole(string $role): int
    {
        return User::query()->where('role', $role)->count();
    }

    public function create(array $data): User
    {
        return User::query()->create($data);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function delete(User $user): ?bool
    {
        return $user->delete();
    }
}
