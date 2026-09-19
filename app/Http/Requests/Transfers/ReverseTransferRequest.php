<?php

namespace App\Http\Requests\Transfers;

use App\Models\InterProjectTransfer;
use Illuminate\Foundation\Http\FormRequest;

class ReverseTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var InterProjectTransfer $transfer */
        $transfer = $this->route('transfer');

        return $this->user()->can('reverse', $transfer);
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
