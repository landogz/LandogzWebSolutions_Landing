<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;

class ClientsPublicController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = Client::query()->orderBy('sort_order')->get();

        return $this->success(ClientResource::collection($items));
    }
}
