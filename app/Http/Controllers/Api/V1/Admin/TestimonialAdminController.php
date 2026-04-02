<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTestimonialRequest;
use App\Http\Requests\Admin\UpdateTestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;

class TestimonialAdminController extends Controller
{
    use ApiResponses;

    public function __construct(protected ImageOptimizationService $images) {}

    public function index(): JsonResponse
    {
        $items = Testimonial::query()->orderBy('sort_order')->get();

        return $this->success(TestimonialResource::collection($items));
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('photo')) {
            $data['photo_path'] = $this->images->storeAndOptimize($request->file('photo'), 'testimonials/photos');
        }
        unset($data['photo']);
        $row = Testimonial::query()->create($data);

        return $this->success(new TestimonialResource($row), 'Testimonial created.', 201);
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return $this->success(new TestimonialResource($testimonial));
    }

    public function update(UpdateTestimonialRequest $request, Testimonial $testimonial): JsonResponse
    {
        $data = $request->validated();
        if ($request->hasFile('photo')) {
            $this->images->delete($testimonial->photo_path);
            $data['photo_path'] = $this->images->storeAndOptimize($request->file('photo'), 'testimonials/photos');
        }
        unset($data['photo']);
        $testimonial->update($data);

        return $this->success(new TestimonialResource($testimonial->fresh()), 'Testimonial updated.');
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $this->images->delete($testimonial->photo_path);
        $testimonial->delete();

        return $this->success(null, 'Testimonial deleted.');
    }
}
