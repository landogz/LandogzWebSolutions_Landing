<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'max:5120'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'message' => ['required', 'string'],
            'status' => ['required', 'in:draft,published'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
