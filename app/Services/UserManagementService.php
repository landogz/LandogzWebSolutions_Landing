<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Validation\ValidationException;

class UserManagementService
{
    public function __construct(protected UserRepository $users) {}

    public function listPaginated(?string $search, int $perPage): array
    {
        $paginator = $this->users->paginate($search, $perPage);

        return [
            'items' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ];
    }

    public function create(array $data): User
    {
        return $this->users->create($data);
    }

    public function update(User $target, array $data, User $actor): User
    {
        if (isset($data['role']) && $data['role'] !== 'super_admin' && $target->role === 'super_admin') {
            $this->ensureNotLastSuperAdmin($target);
        }

        if (array_key_exists('password', $data) && ($data['password'] === null || $data['password'] === '')) {
            unset($data['password']);
        }

        $this->users->update($target, $data);

        return $target->fresh();
    }

    public function delete(User $target, User $actor): void
    {
        if ($target->is($actor)) {
            throw ValidationException::withMessages([
                'user' => ['You cannot delete your own account.'],
            ]);
        }

        if ($target->role === 'super_admin') {
            $this->ensureNotLastSuperAdmin($target);
        }

        $this->users->delete($target);
    }

    protected function ensureNotLastSuperAdmin(User $user): void
    {
        if ($user->role !== 'super_admin') {
            return;
        }

        if ($this->users->countByRole('super_admin') <= 1) {
            throw ValidationException::withMessages([
                'role' => ['There must be at least one super administrator.'],
            ]);
        }
    }
}
