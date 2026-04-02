<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'max:64'],
            'icon' => ['nullable', 'image', 'max:2048'],
            'proficiency' => ['nullable', 'integer', 'min:0', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
