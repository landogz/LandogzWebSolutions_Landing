<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:500'],
            'founding_year' => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'description' => ['nullable', 'string'],
            'mission' => ['nullable', 'string'],
            'vision' => ['nullable', 'string'],
        ];
    }
}
