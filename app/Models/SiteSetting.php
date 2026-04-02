<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'company_name',
        'logo_path',
        'favicon_path',
        'email',
        'phone',
        'address',
        'maps_embed_url',
        'social_links',
        'footer_text',
        'seo_default_title',
        'seo_default_description',
        'seo_default_keywords',
        'seo_per_page',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'seo_per_page' => 'array',
        ];
    }
}
