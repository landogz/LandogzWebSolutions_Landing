<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'headline' => ['required', 'string', 'max:500'],
            'animated_words' => ['nullable', 'array'],
            'animated_words.*' => ['string', 'max:100'],
            'subheading' => ['nullable', 'string', 'max:2000'],
            'cta_primary_text' => ['nullable', 'string', 'max:255'],
            'cta_primary_url' => ['nullable', 'string', 'max:2000'],
            'cta_secondary_text' => ['nullable', 'string', 'max:255'],
            'cta_secondary_url' => ['nullable', 'string', 'max:2000'],
            'background_type' => ['nullable', 'string', 'in:gradient,particles,mesh,geometric'],
            'company_tagline' => ['nullable', 'string', 'max:500'],
        ];
    }
}
