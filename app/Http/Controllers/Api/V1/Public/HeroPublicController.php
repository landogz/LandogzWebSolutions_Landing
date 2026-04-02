<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\HeroSettingResource;
use App\Models\HeroSetting;
use Illuminate\Http\JsonResponse;

class HeroPublicController extends Controller
{
    use ApiResponses;

    public function show(): JsonResponse
    {
        $hero = HeroSetting::query()->first();

        return $this->success($hero ? new HeroSettingResource($hero) : null);
    }
}
