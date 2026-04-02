<?php

namespace App\Http\Resources;

use App\Helpers\MediaHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_name' => $this->client_name,
            'company' => $this->company,
            'photo_path' => $this->photo_path,
            'photo_url' => MediaHelper::publicUrl($this->photo_path),
            'rating' => (int) $this->rating,
            'message' => $this->message,
            'status' => $this->status,
            'sort_order' => $this->sort_order,
        ];
    }
}
