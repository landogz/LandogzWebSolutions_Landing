<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['nullable', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'favicon' => ['nullable', 'image', 'max:1024'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string'],
            'maps_embed_url' => ['nullable', 'string'],
            'social_links' => ['nullable'],
            'footer_text' => ['nullable', 'string'],
            'seo_default_title' => ['nullable', 'string', 'max:255'],
            'seo_default_description' => ['nullable', 'string', 'max:5000'],
            'seo_default_keywords' => ['nullable', 'string', 'max:500'],
            'seo_og_image' => ['nullable', 'image', 'max:5120'],
            'seo_robots' => ['nullable', 'string', 'max:160'],
            'seo_twitter_handle' => ['nullable', 'string', 'max:64'],
            'seo_canonical_base_url' => ['nullable', 'string', 'max:512'],
            'seo_per_page' => ['nullable'],
        ];
    }
}
