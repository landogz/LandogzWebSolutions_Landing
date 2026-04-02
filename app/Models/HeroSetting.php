<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSetting extends Model
{
    protected $fillable = [
        'headline',
        'animated_words',
        'subheading',
        'cta_primary_text',
        'cta_primary_url',
        'cta_secondary_text',
        'cta_secondary_url',
        'background_type',
        'company_tagline',
    ];

    protected function casts(): array
    {
        return [
            'animated_words' => 'array',
        ];
    }
}
