<?php

namespace App\Models;

use App\Enums\PayslipItemType;
use Database\Factories\PayslipItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $payslip_id
 * @property PayslipItemType $type
 * @property string $name
 * @property string $amount
 * @property int|null $project_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Payslip $payslip
 * @property-read Project|null $project
 */
#[Fillable(['payslip_id', 'type', 'name', 'amount', 'project_id'])]
class PayslipItem extends Model
{
    /** @use HasFactory<PayslipItemFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => PayslipItemType::class,
            'amount' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Payslip, $this>
     */
    public function payslip(): BelongsTo
    {
        return $this->belongsTo(Payslip::class);
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
