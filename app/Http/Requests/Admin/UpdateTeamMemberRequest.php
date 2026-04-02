<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('social_links') && is_string($this->input('social_links'))) {
            $decoded = json_decode($this->input('social_links'), true);
            $this->merge(['social_links' => is_array($decoded) ? $decoded : []]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'position' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'social_links.linkedin' => ['nullable', 'string', 'max:2000'],
            'social_links.github' => ['nullable', 'string', 'max:2000'],
            'social_links.twitter' => ['nullable', 'string', 'max:2000'],
            'photo' => ['nullable', 'image', 'max:5120'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
