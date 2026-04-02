<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateAboutRequest;
use App\Http\Resources\AboutResource;
use App\Models\About;
use Illuminate\Http\JsonResponse;

class AboutAdminController extends Controller
{
    use ApiResponses;

    public function show(): JsonResponse
    {
        $about = About::query()->first();

        return $this->success($about ? new AboutResource($about) : null);
    }

    public function update(UpdateAboutRequest $request): JsonResponse
    {
        $about = About::query()->firstOrNew([]);
        $about->fill($request->validated());
        $about->save();

        return $this->success(new AboutResource($about->fresh()), 'About updated.');
    }
}
