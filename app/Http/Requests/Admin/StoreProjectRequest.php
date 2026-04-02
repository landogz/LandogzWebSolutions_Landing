<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('tech_stack') && is_string($this->input('tech_stack'))) {
            $decoded = json_decode($this->input('tech_stack'), true);
            $this->merge(['tech_stack' => is_array($decoded) ? $decoded : []]);
        }
    }

    public function rules(): array
    {
        return [
            'project_category_id' => ['nullable', 'exists:project_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:projects,slug'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'full_description' => ['nullable', 'string'],
            'thumbnail' => ['nullable', 'image', 'max:5120'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'max:5120'],
            'gallery_paths' => ['nullable', 'array'],
            'tech_stack' => ['nullable', 'array'],
            'tech_stack.*' => ['string', 'max:100'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'project_url' => ['nullable', 'string', 'max:2000'],
            'github_url' => ['nullable', 'string', 'max:2000'],
            'duration' => ['nullable', 'string', 'max:255'],
            'is_featured' => ['nullable', 'boolean'],
            'status' => ['required', 'in:draft,published'],
        ];
    }
}
