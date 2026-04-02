<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAboutStatRequest;
use App\Http\Requests\Admin\UpdateAboutStatRequest;
use App\Http\Resources\AboutStatResource;
use App\Models\AboutStat;
use Illuminate\Http\JsonResponse;

class AboutStatAdminController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = AboutStat::query()->orderBy('sort_order')->get();

        return $this->success(AboutStatResource::collection($items));
    }

    public function store(StoreAboutStatRequest $request): JsonResponse
    {
        $stat = AboutStat::query()->create($request->validated());

        return $this->success(new AboutStatResource($stat), 'Stat created.', 201);
    }

    public function show(AboutStat $aboutStat): JsonResponse
    {
        return $this->success(new AboutStatResource($aboutStat));
    }

    public function update(UpdateAboutStatRequest $request, AboutStat $aboutStat): JsonResponse
    {
        $aboutStat->update($request->validated());

        return $this->success(new AboutStatResource($aboutStat->fresh()), 'Stat updated.');
    }

    public function destroy(AboutStat $aboutStat): JsonResponse
    {
        $aboutStat->delete();

        return $this->success(null, 'Stat deleted.');
    }
}
