<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;

class SkillsPublicController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = Skill::query()->orderBy('category')->orderBy('sort_order')->get();

        return $this->success(SkillResource::collection($items));
    }
}
