<?php

namespace App\Http\Resources;

use App\Helpers\MediaHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'icon_path' => $this->icon_path,
            'icon_url' => MediaHelper::publicUrl($this->icon_path),
            'proficiency' => (int) $this->proficiency,
            'sort_order' => $this->sort_order,
        ];
    }
}
