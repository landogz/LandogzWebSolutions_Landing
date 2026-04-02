<?php

namespace App\Http\Resources;

use App\Helpers\MediaHelper;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'logo_path' => $this->logo_path,
            'logo_url' => MediaHelper::publicUrl($this->logo_path),
            'favicon_path' => $this->favicon_path,
            'favicon_url' => MediaHelper::publicUrl($this->favicon_path),
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'maps_embed_url' => $this->maps_embed_url,
            'social_links' => $this->social_links ?? [],
            'footer_text' => $this->footer_text,
            'seo_default_title' => $this->seo_default_title,
            'seo_default_description' => $this->seo_default_description,
            'seo_default_keywords' => $this->seo_default_keywords,
            'seo_per_page' => $this->seo_per_page ?? [],
        ];
    }
}
