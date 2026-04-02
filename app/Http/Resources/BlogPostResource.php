<?php

namespace App\Http\Resources;

use App\Helpers\MediaHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'featured_image_path' => $this->featured_image_path,
            'featured_image_url' => MediaHelper::publicUrl($this->featured_image_path),
            'category' => $this->category,
            'tags' => $this->tags ?? [],
            'content' => $this->content,
            'excerpt' => $this->excerpt,
            'author' => $this->author,
            'published_at' => $this->published_at?->toIso8601String(),
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
