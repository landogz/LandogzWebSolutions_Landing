<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateHeroSettingRequest;
use App\Http\Resources\HeroSettingResource;
use App\Models\HeroSetting;
use Illuminate\Http\JsonResponse;

class HeroAdminController extends Controller
{
    use ApiResponses;

    public function show(): JsonResponse
    {
        $hero = HeroSetting::query()->first();

        return $this->success($hero ? new HeroSettingResource($hero) : null);
    }

    public function update(UpdateHeroSettingRequest $request): JsonResponse
    {
        $hero = HeroSetting::query()->firstOrNew([]);
        $hero->fill($request->validated());
        $hero->save();

        return $this->success(new HeroSettingResource($hero->fresh()), 'Hero updated.');
    }
}
