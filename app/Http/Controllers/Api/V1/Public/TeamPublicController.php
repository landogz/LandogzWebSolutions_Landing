<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\TeamMemberResource;
use App\Repositories\TeamMemberRepository;
use Illuminate\Http\JsonResponse;

class TeamPublicController extends Controller
{
    use ApiResponses;

    public function __construct(protected TeamMemberRepository $teamMemberRepository) {}

    public function index(): JsonResponse
    {
        $items = $this->teamMemberRepository->orderedPublic();

        return $this->success(TeamMemberResource::collection($items));
    }
}
