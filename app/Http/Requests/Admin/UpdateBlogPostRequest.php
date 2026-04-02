<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBlogPostRequest extends FormRequest
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
        $param = $this->route('blog_post');
        $id = is_object($param) ? $param->id : $param;

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('blog_posts', 'slug')->ignore($id)],
            'featured_image' => ['nullable', 'image', 'max:5120'],
            'category' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:100'],
            'content' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string', 'max:2000'],
            'author' => ['nullable', 'string', 'max:255'],
            'published_at' => ['nullable', 'date'],
            'status' => ['sometimes', 'in:draft,published'],
        ];
    }
}
