<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreContactMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['required', 'string', 'min:8', 'max:20'],
            'message' => ['required', 'string', 'min:2', 'max:1000'],
            'page_url' => ['nullable', 'string', 'max:2000'],
            'source' => ['nullable', 'string', 'max:100'],
            'locale' => ['nullable', 'string', 'max:10'],
            'user_agent' => ['nullable', 'string', 'max:500'],
            'website' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        $locale = $this->input('locale', $this->getPreferredLanguage(['ar', 'en']) ?? 'ar');

        if ($locale === 'en') {
            return [
                'phone.required' => 'Phone number is required.',
                'phone.min' => 'Phone number is too short.',
                'message.required' => 'Message is required.',
                'message.min' => 'Message must be at least 2 characters.',
                'message.max' => 'Message must not exceed 1000 characters.',
            ];
        }

        return [
            'phone.required' => 'رقم التواصل مطلوب.',
            'phone.min' => 'رقم التواصل قصير جداً.',
            'message.required' => 'الرسالة مطلوبة.',
            'message.min' => 'الرسالة قصيرة جداً.',
            'message.max' => 'الرسالة طويلة جداً.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422));
    }
}
