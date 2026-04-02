<?php

namespace App\Http\Resources;

use App\Helpers\MediaHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $gallery = collect($this->gallery_paths ?? [])->map(fn ($p) => MediaHelper::publicUrl($p))->filter()->values();

        return [
            'id' => $this->id,
            'project_category_id' => $this->project_category_id,
            'category' => $this->whenLoaded('category', fn () => new ProjectCategoryResource($this->category)),
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'full_description' => $this->full_description,
            'thumbnail_path' => $this->thumbnail_path,
            'thumbnail_url' => MediaHelper::publicUrl($this->thumbnail_path),
            'gallery_paths' => $this->gallery_paths ?? [],
            'gallery_urls' => $gallery,
            'tech_stack' => $this->tech_stack ?? [],
            'client_name' => $this->client_name,
            'project_url' => $this->project_url,
            'github_url' => $this->github_url,
            'duration' => $this->duration,
            'is_featured' => (bool) $this->is_featured,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
