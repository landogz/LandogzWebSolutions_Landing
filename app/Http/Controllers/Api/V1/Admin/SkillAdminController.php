<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSkillRequest;
use App\Http\Requests\Admin\UpdateSkillRequest;
use App\Http\Resources\SkillResource;
use App\Models\Skill;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SkillAdminController extends Controller
{
    use ApiResponses;

    public function __construct(protected ImageOptimizationService $images) {}

    public function index(Request $request): JsonResponse
    {
        $q = Skill::query();
        if ($request->query('category')) {
            $q->where('category', $request->query('category'));
        }
        if ($request->query('search')) {
            $s = $request->query('search');
            $q->where('name', 'like', '%'.$s.'%');
        }
        $items = $q->orderBy('category')->orderBy('sort_order')->paginate((int) $request->query('per_page', 20));

        return $this->success([
            'items' => SkillResource::collection($items->items()),
            'pagination' => [
                'total' => $items->total(),
                'per_page' => $items->perPage(),
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
            ],
        ]);
    }

    public function store(StoreSkillRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('icon')) {
            $data['icon_path'] = $this->images->storeAndOptimize($request->file('icon'), 'skills/icons', 512);
        }
        unset($data['icon']);
        $row = Skill::query()->create($data);

        return $this->success(new SkillResource($row), 'Skill created.', 201);
    }

    public function show(Skill $skill): JsonResponse
    {
        return $this->success(new SkillResource($skill));
    }

    public function update(UpdateSkillRequest $request, Skill $skill): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('icon')) {
            $this->images->delete($skill->icon_path);
            $data['icon_path'] = $this->images->storeAndOptimize($request->file('icon'), 'skills/icons', 512);
        }
        unset($data['icon']);
        $skill->update($data);

        return $this->success(new SkillResource($skill->fresh()), 'Skill updated.');
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $this->images->delete($skill->icon_path);
        $skill->delete();

        return $this->success(null, 'Skill deleted.');
    }
}
