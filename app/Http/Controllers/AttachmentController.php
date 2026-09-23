<?php

namespace App\Http\Controllers;

use App\Concerns\FlashesToast;
use App\Http\Requests\StoreAttachmentRequest;
use App\Models\Attachment;
use App\Models\Employee;
use App\Models\Expense;
use App\Models\JournalEntry;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttachmentController extends Controller
{
    use FlashesToast;

    /** @var array<string, class-string> */
    private const ATTACHABLE_MAP = [
        'expense' => Expense::class,
        'employee' => Employee::class,
        'project' => Project::class,
        'journal_entry' => JournalEntry::class,
    ];

    /** @var array<string, string> */
    private const PERMISSION_MAP = [
        'expense' => 'expenses.create',
        'employee' => 'employees.create',
        'project' => 'projects.create',
        'journal_entry' => 'accounting.create',
    ];

    /** @var array<string, string> */
    private const VIEW_PERMISSION_MAP = [
        'expense' => 'expenses.view',
        'employee' => 'employees.view',
        'project' => 'projects.view',
        'journal_entry' => 'accounting.view',
    ];

    public function store(StoreAttachmentRequest $request): RedirectResponse
    {
        $type = $request->validated('attachable_type');
        $modelClass = self::ATTACHABLE_MAP[$type];
        $model = $modelClass::findOrFail($request->validated('attachable_id'));

        $file = $request->file('file');
        $path = $file->store("attachments/{$type}/{$model->id}", 'local');

        Attachment::create([
            'attachable_type' => $modelClass,
            'attachable_id' => $model->id,
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $request->user()->id,
        ]);

        $this->flashSuccess('File uploaded successfully.');

        return back();
    }

    public function download(Request $request, Attachment $attachment): StreamedResponse
    {
        $this->authorizeView($request, $attachment);

        abort_unless(Storage::disk('local')->exists($attachment->file_path), 404);

        return Storage::disk('local')->download($attachment->file_path, $attachment->file_name);
    }

    public function destroy(Request $request, Attachment $attachment): RedirectResponse
    {
        $this->authorizeModify($request, $attachment);

        Storage::disk('local')->delete($attachment->file_path);
        $attachment->delete();

        $this->flashSuccess('File deleted successfully.');

        return back();
    }

    private function authorizeView(Request $request, Attachment $attachment): void
    {
        $type = $this->resolveTypeKey($attachment->attachable_type);
        $permission = self::VIEW_PERMISSION_MAP[$type] ?? null;

        abort_unless($permission && $request->user()->can($permission), 403);
    }

    private function authorizeModify(Request $request, Attachment $attachment): void
    {
        if ($request->user()->id === $attachment->uploaded_by) {
            return;
        }

        $type = $this->resolveTypeKey($attachment->attachable_type);
        $permission = self::PERMISSION_MAP[$type] ?? null;

        abort_unless($permission && $request->user()->can($permission), 403);
    }

    private function resolveTypeKey(string $morphClass): string
    {
        foreach (self::ATTACHABLE_MAP as $key => $class) {
            if ($class === $morphClass) {
                return $key;
            }
        }

        abort(422, 'Unknown attachable type.');
    }
}
