<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\AboutResource;
use App\Http\Resources\AboutStatResource;
use App\Http\Resources\CompanyValueResource;
use App\Models\About;
use App\Models\AboutStat;
use App\Models\CompanyValue;
use Illuminate\Http\JsonResponse;

class AboutPublicController extends Controller
{
    use ApiResponses;

    public function show(): JsonResponse
    {
        $about = About::query()->first();
        $stats = AboutStat::query()->orderBy('sort_order')->get();
        $values = CompanyValue::query()->orderBy('sort_order')->get();

        return $this->success([
            'about' => $about ? new AboutResource($about) : null,
            'stats' => AboutStatResource::collection($stats),
            'values' => CompanyValueResource::collection($values),
        ]);
    }
}
