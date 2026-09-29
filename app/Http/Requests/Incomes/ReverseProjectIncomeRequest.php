<?php

namespace App\Http\Requests\Incomes;

use App\Models\ProjectIncome;
use Illuminate\Foundation\Http\FormRequest;

class ReverseProjectIncomeRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var ProjectIncome $income */
        $income = $this->route('income');

        return $this->user()->can('reverse', $income);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reason' => ['nullable', 'string', 'max:500'],
        ];
    }
}
