<?php

namespace App\Http\Resources;

use App\Helpers\MediaHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamMemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'photo_path' => $this->photo_path,
            'photo_url' => MediaHelper::publicUrl($this->photo_path),
            'name' => $this->name,
            'position' => $this->position,
            'bio' => $this->bio,
            'social_links' => $this->social_links ?? [],
            'sort_order' => $this->sort_order,
        ];
    }
}
