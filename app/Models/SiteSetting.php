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
        'seo_og_image_path',
        'seo_robots',
        'seo_twitter_handle',
        'seo_canonical_base_url',
        'seo_per_page',
        'google_analytics_measurement_id',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'seo_per_page' => 'array',
        ];
    }
}
