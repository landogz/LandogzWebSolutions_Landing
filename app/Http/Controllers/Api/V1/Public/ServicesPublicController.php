<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceResource;
use App\Models\Service as ServiceModel;
use Illuminate\Http\JsonResponse;

class ServicesPublicController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = ServiceModel::query()->orderBy('sort_order')->get();

        return $this->success(ServiceResource::collection($items));
    }
}
