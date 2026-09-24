<?php

namespace App\Http\Controllers;

use App\Enums\PayrollStatus;
use App\Models\PayrollRun;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;

class PayrollReportController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('reports.payroll'), 403);

        $data = $this->getReportData($request);

        return Inertia::render('reports/payroll-report', $data);
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        abort_unless($request->user()->can('reports.payroll'), 403);

        $data = $this->getReportData($request);
        $format = $request->input('format', 'pdf');

        if ($format === 'excel') {
            $path = tempnam(sys_get_temp_dir(), 'export').'.xlsx';
            $writer = SimpleExcelWriter::create($path);

            foreach ($data['runs'] as $run) {
                foreach ($run['payslips'] as $slip) {
                    $writer->addRow([
                        'Run Reference' => $run['reference'],
                        'Period Start' => $run['period_start'],
                        'Period End' => $run['period_end'],
                        'Employee' => $slip['employee_name'],
                        'Designation' => $slip['designation'],
                        'Days Worked' => $slip['days_worked'],
                        'Days Absent' => $slip['days_absent'],
                        'Basic Salary' => $slip['basic_salary'],
                        'Deductions' => $slip['deductions'],
                        'Net Salary' => $slip['net_salary'],
                    ]);
                }
            }

            $writer->close();

            return response()->download($path, 'payroll-report.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.payroll-report', $data);

        return $pdf->download('payroll-report.pdf');
    }

    /**
     * @return array{runs: list<array<string, mixed>>, totalRuns: int, totalEmployees: int, totalDisbursed: string}
     */
    private function getReportData(Request $request): array
    {
        $runs = PayrollRun::query()
            ->where('status', PayrollStatus::Approved)
            ->when($request->input('date_from'), fn ($q, $d) => $q->whereDate('period_start', '>=', $d))
            ->when($request->input('date_to'), fn ($q, $d) => $q->whereDate('period_end', '<=', $d))
            ->with(['payslips.employee:id,name,designation,department,type'])
            ->orderBy('period_start', 'desc')
            ->get();

        $totalRuns = $runs->count();
        $totalEmployees = 0;
        $totalDisbursed = '0.00';

        $reportRuns = [];

        foreach ($runs as $run) {
            $runEmployees = $run->payslips->count();
            $totalEmployees += $runEmployees;
            $totalDisbursed = bcadd($totalDisbursed, $run->total_amount, 2);

            $reportRuns[] = [
                'id' => $run->id,
                'reference' => $run->reference,
                'period_start' => $run->period_start->format('d-m-Y'),
                'period_end' => $run->period_end->format('d-m-Y'),
                'total_amount' => $run->total_amount,
                'payslips_count' => $runEmployees,
                'payslips' => $run->payslips->map(fn ($slip) => [
                    'id' => $slip->id,
                    'employee_name' => $slip->employee?->name ?? 'Unknown',
                    'designation' => $slip->employee?->designation ?? '',
                    'department' => $slip->employee?->department ?? '',
                    'basic_salary' => $slip->basic_salary,
                    'deductions' => $slip->deductions,
                    'net_salary' => $slip->net_salary,
                    'days_worked' => $slip->days_worked,
                    'days_absent' => $slip->days_absent,
                ])->values()->all(),
            ];
        }

        return [
            'runs' => $reportRuns,
            'totalRuns' => $totalRuns,
            'totalEmployees' => $totalEmployees,
            'totalDisbursed' => $totalDisbursed,
        ];
    }
}
