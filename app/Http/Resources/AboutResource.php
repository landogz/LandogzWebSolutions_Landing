<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AboutResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'tagline' => $this->tagline,
            'founding_year' => $this->founding_year,
            'description' => $this->description,
            'mission' => $this->mission,
            'vision' => $this->vision,
        ];
    }
}
