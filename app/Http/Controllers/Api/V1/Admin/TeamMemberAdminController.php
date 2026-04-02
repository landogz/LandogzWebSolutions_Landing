<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamMemberRequest;
use App\Http\Requests\Admin\UpdateTeamMemberRequest;
use App\Http\Resources\TeamMemberResource;
use App\Models\TeamMember;
use App\Repositories\TeamMemberRepository;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeamMemberAdminController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected TeamMemberRepository $teamRepo,
        protected ImageOptimizationService $images
    ) {}

    public function index(Request $request): JsonResponse
    {
        $paginator = $this->teamRepo->paginateAdmin(
            (int) $request->query('per_page', 15),
            $request->query('search')
        );

        return $this->success([
            'items' => TeamMemberResource::collection($paginator->items()),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function store(StoreTeamMemberRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $this->images->storeAndOptimize($request->file('photo'), 'team/photos');
        }
        unset($data['photo']);
        $row = TeamMember::query()->create($data);

        return $this->success(new TeamMemberResource($row), 'Team member created.', 201);
    }

    public function show(TeamMember $teamMember): JsonResponse
    {
        return $this->success(new TeamMemberResource($teamMember));
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('photo')) {
            $this->images->delete($teamMember->photo_path);
            $data['photo_path'] = $this->images->storeAndOptimize($request->file('photo'), 'team/photos');
        }
        unset($data['photo']);
        $teamMember->update($data);

        return $this->success(new TeamMemberResource($teamMember->fresh()), 'Team member updated.');
    }

    public function destroy(TeamMember $teamMember): JsonResponse
    {
        $this->images->delete($teamMember->photo_path);
        $teamMember->delete();

        return $this->success(null, 'Team member deleted.');
    }
}
