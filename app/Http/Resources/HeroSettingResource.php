<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HeroSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'headline' => $this->headline,
            'animated_words' => $this->animated_words ?? [],
            'subheading' => $this->subheading,
            'cta_primary_text' => $this->cta_primary_text,
            'cta_primary_url' => $this->cta_primary_url,
            'cta_secondary_text' => $this->cta_secondary_text,
            'cta_secondary_url' => $this->cta_secondary_url,
            'background_type' => $this->background_type,
            'company_tagline' => $this->company_tagline,
        ];
    }
}
