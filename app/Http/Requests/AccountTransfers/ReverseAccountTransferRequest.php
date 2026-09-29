<?php

namespace App\Http\Requests\AccountTransfers;

use App\Models\AccountTransfer;
use Illuminate\Foundation\Http\FormRequest;

class ReverseAccountTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var AccountTransfer $accountTransfer */
        $accountTransfer = $this->route('account_transfer');

        return $this->user()->can('reverse', $accountTransfer);
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
