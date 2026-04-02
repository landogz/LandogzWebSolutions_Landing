<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'project_category_id',
        'title',
        'slug',
        'short_description',
        'full_description',
        'thumbnail_path',
        'gallery_paths',
        'tech_stack',
        'client_name',
        'project_url',
        'github_url',
        'duration',
        'is_featured',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'gallery_paths' => 'array',
            'tech_stack' => 'array',
            'is_featured' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
