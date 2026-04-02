<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteSettingsPublicController extends Controller
{
    use ApiResponses;

    public function show(): JsonResponse
    {
        $s = SiteSetting::query()->first();

        return $this->success($s ? new SiteSettingResource($s) : null);
    }
}
