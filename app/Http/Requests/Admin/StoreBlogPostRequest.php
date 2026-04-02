<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('tags') && is_string($this->input('tags'))) {
            $decoded = json_decode($this->input('tags'), true);
            $this->merge(['tags' => is_array($decoded) ? $decoded : []]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:blog_posts,slug'],
            'featured_image' => ['nullable', 'image', 'max:5120'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:100'],
            'content' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string', 'max:2000'],
            'author' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
            'status' => ['required', 'in:draft,published'],
        ];
    }
}
