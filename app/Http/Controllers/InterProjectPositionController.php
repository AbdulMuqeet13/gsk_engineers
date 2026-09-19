<?php

namespace App\Http\Controllers;

use App\Models\InterProjectTransfer;
use App\Models\Project;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\SimpleExcel\SimpleExcelWriter;

class InterProjectPositionController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', InterProjectTransfer::class);

        $data = $this->getReportData($request);

        return Inertia::render('reports/inter-project-position', array_merge($data, [
            'projects' => Inertia::optional(fn () => Project::select('id', 'name', 'code')
                ->orderBy('name')
                ->get()),
        ]));
    }

    public function export(Request $request): \Symfony\Component\HttpFoundation\Response
    {
        $this->authorize('viewAny', InterProjectTransfer::class);

        $data = $this->getReportData($request);
        $format = $request->input('format', 'pdf');

        if ($format === 'excel') {
            $path = tempnam(sys_get_temp_dir(), 'export').'.xlsx';
            $writer = SimpleExcelWriter::create($path);

            foreach ($data['positions'] as $pos) {
                $writer->addRow([
                    'Project A' => $pos['project_a']['code'].' - '.$pos['project_a']['name'],
                    'Project B' => $pos['project_b']['code'].' - '.$pos['project_b']['name'],
                    'A sent to B' => $pos['a_to_b'],
                    'B sent to A' => $pos['b_to_a'],
                    'Net (A owes B)' => $pos['net'],
                ]);
            }

            $writer->close();

            return response()->download($path, 'inter-project-position.xlsx')->deleteFileAfterSend(true);
        }

        $pdf = Pdf::loadView('reports.inter-project-position', $data);

        return $pdf->download('inter-project-position.pdf');
    }

    /**
     * @return array{positions: list<array<string, mixed>>}
     */
    private function getReportData(Request $request): array
    {
        $query = InterProjectTransfer::query()
            ->join('journal_entries', 'inter_project_transfers.journal_entry_id', '=', 'journal_entries.id')
            ->whereNull('journal_entries.reversed_by_id')
            ->select(
                'inter_project_transfers.from_project_id',
                'inter_project_transfers.to_project_id',
                DB::raw('SUM(inter_project_transfers.amount) as total_amount'),
            )
            ->groupBy('from_project_id', 'to_project_id');

        if ($request->input('project_id')) {
            $projectId = $request->input('project_id');
            $query->where(function ($q) use ($projectId) {
                $q->where('from_project_id', $projectId)
                    ->orWhere('to_project_id', $projectId);
            });
        }

        $transfers = $query->get();

        $projects = Project::select('id', 'name', 'code')->get()->keyBy('id');

        $pairs = [];

        foreach ($transfers as $row) {
            $key = min($row->from_project_id, $row->to_project_id).'-'.max($row->from_project_id, $row->to_project_id);

            if (! isset($pairs[$key])) {
                $lowId = min($row->from_project_id, $row->to_project_id);
                $highId = max($row->from_project_id, $row->to_project_id);

                $pairs[$key] = [
                    'project_a' => $projects[$lowId] ? [
                        'id' => $projects[$lowId]->id,
                        'name' => $projects[$lowId]->name,
                        'code' => $projects[$lowId]->code,
                    ] : null,
                    'project_b' => $projects[$highId] ? [
                        'id' => $projects[$highId]->id,
                        'name' => $projects[$highId]->name,
                        'code' => $projects[$highId]->code,
                    ] : null,
                    'a_to_b' => '0.00',
                    'b_to_a' => '0.00',
                    'net' => '0.00',
                ];
            }

            $lowId = min($row->from_project_id, $row->to_project_id);

            if ($row->from_project_id === $lowId) {
                $pairs[$key]['a_to_b'] = bcadd($pairs[$key]['a_to_b'], $row->total_amount, 2);
            } else {
                $pairs[$key]['b_to_a'] = bcadd($pairs[$key]['b_to_a'], $row->total_amount, 2);
            }
        }

        foreach ($pairs as &$pair) {
            $pair['net'] = bcsub($pair['a_to_b'], $pair['b_to_a'], 2);
        }

        return [
            'positions' => array_values($pairs),
        ];
    }
}
