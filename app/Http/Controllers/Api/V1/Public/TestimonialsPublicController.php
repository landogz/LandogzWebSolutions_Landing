<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Concerns\ApiResponses;
use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialsPublicController extends Controller
{
    use ApiResponses;

    public function index(): JsonResponse
    {
        $items = Testimonial::query()->published()->orderBy('sort_order')->get();

        return $this->success(TestimonialResource::collection($items));
    }
}
