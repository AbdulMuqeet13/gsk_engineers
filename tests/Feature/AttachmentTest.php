<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\AccountHead;
use App\Models\Attachment;
use App\Models\Expense;
use App\Models\Project;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AttachmentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Expense $expense;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
        $this->withoutVite();

        Storage::fake('local');

        $this->user = User::factory()->create();
        $this->user->assignRole(RoleEnum::SuperAdmin);

        $expenseAccount = AccountHead::factory()->expense()->create();
        $cashAccount = AccountHead::factory()->asset()->create();

        $this->expense = Expense::factory()->draft()->create([
            'account_head_id' => $expenseAccount->id,
            'payment_account_id' => $cashAccount->id,
            'created_by' => $this->user->id,
        ]);
    }

    public function test_upload_requires_authentication(): void
    {
        $this->post(route('attachments.store'))
            ->assertRedirect(route('login'));
    }

    public function test_upload_requires_permission(): void
    {
        $viewer = User::factory()->create();
        $viewer->assignRole(RoleEnum::Viewer);

        $this->actingAs($viewer)
            ->post(route('attachments.store'), [
                'file' => UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf'),
                'attachable_type' => 'expense',
                'attachable_id' => $this->expense->id,
            ])
            ->assertForbidden();
    }

    public function test_upload_stores_file_and_creates_record(): void
    {
        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $this->actingAs($this->user)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'expense',
                'attachable_id' => $this->expense->id,
            ])
            ->assertRedirect();

        $this->assertDatabaseCount('attachments', 1);

        $attachment = Attachment::first();
        $this->assertEquals('receipt.pdf', $attachment->file_name);
        $this->assertEquals($this->user->id, $attachment->uploaded_by);

        Storage::disk('local')->assertExists($attachment->file_path);
    }

    public function test_upload_validates_file_type(): void
    {
        $file = UploadedFile::fake()->create('malware.exe', 100);

        $this->actingAs($this->user)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'expense',
                'attachable_id' => $this->expense->id,
            ])
            ->assertSessionHasErrors('file');
    }

    public function test_upload_validates_attachable_type(): void
    {
        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $this->actingAs($this->user)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'invalid_type',
                'attachable_id' => $this->expense->id,
            ])
            ->assertSessionHasErrors('attachable_type');
    }

    public function test_download_streams_file(): void
    {
        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $this->actingAs($this->user)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'expense',
                'attachable_id' => $this->expense->id,
            ]);

        $attachment = Attachment::first();

        $response = $this->actingAs($this->user)
            ->get(route('attachments.download', $attachment));

        $response->assertOk();
        $response->assertDownload('receipt.pdf');
    }

    public function test_download_requires_view_permission(): void
    {
        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $this->actingAs($this->user)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'expense',
                'attachable_id' => $this->expense->id,
            ]);

        $attachment = Attachment::first();

        $noPermsUser = User::factory()->create();

        $this->actingAs($noPermsUser)
            ->get(route('attachments.download', $attachment))
            ->assertForbidden();
    }

    public function test_delete_removes_file_and_record(): void
    {
        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $this->actingAs($this->user)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'expense',
                'attachable_id' => $this->expense->id,
            ]);

        $attachment = Attachment::first();
        $path = $attachment->file_path;

        $this->actingAs($this->user)
            ->delete(route('attachments.destroy', $attachment))
            ->assertRedirect();

        $this->assertDatabaseCount('attachments', 0);
        Storage::disk('local')->assertMissing($path);
    }

    public function test_delete_allowed_for_uploader(): void
    {
        $uploader = User::factory()->create();
        $uploader->assignRole(RoleEnum::SuperAdmin);

        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $this->actingAs($uploader)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'expense',
                'attachable_id' => $this->expense->id,
            ]);

        $attachment = Attachment::first();

        $this->actingAs($uploader)
            ->delete(route('attachments.destroy', $attachment))
            ->assertRedirect();

        $this->assertDatabaseCount('attachments', 0);
    }

    public function test_project_attachment_upload(): void
    {
        $project = Project::factory()->create();
        $file = UploadedFile::fake()->create('contract.pdf', 200, 'application/pdf');

        $this->actingAs($this->user)
            ->post(route('attachments.store'), [
                'file' => $file,
                'attachable_type' => 'project',
                'attachable_id' => $project->id,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('attachments', [
            'file_name' => 'contract.pdf',
            'attachable_type' => 'App\\Models\\Project',
            'attachable_id' => $project->id,
        ]);
    }
}
