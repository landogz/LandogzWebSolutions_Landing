<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAdminUserRequest;
use App\Http\Requests\Admin\UpdateAdminUserRequest;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use App\Services\UserManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAdminController extends Controller
{
    use ApiResponses;

    public function __construct(protected UserManagementService $users) {}

    public function index(Request $request): JsonResponse
    {
        $data = $this->users->listPaginated(
            $request->query('search'),
            (int) $request->query('per_page', 15),
        );

        return $this->success([
            'items' => AdminUserResource::collection($data['items']),
            'pagination' => $data['pagination'],
        ]);
    }

    public function store(StoreAdminUserRequest $request): JsonResponse
    {
        $user = $this->users->create($request->validated());

        return $this->success(new AdminUserResource($user), 'User created.', 201);
    }

    public function show(User $user): JsonResponse
    {
        return $this->success(new AdminUserResource($user));
    }

    public function update(UpdateAdminUserRequest $request, User $user): JsonResponse
    {
        $updated = $this->users->update($user, $request->validated(), $request->user());

        return $this->success(new AdminUserResource($updated), 'User updated.');
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->users->delete($user, $request->user());

        return $this->success(null, 'User deleted.');
    }
}
