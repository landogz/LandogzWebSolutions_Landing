<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $param = $this->route('project_category');
        $id = is_object($param) ? $param->id : $param;

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('project_categories', 'slug')->ignore($id)],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
