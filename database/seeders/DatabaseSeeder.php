<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the base data required to run the application.
     *
     * Demo records live in DemoDataSeeder and are only seeded on request:
     * php artisan db:seed --class=DemoDataSeeder
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            ChartOfAccountsSeeder::class,
        ]);

        $this->seedSuperAdmin();
    }

    private function seedSuperAdmin(): void
    {
        $email = config('app.super_admin.email');
        $password = config('app.super_admin.password');

        if (blank($email) || blank($password)) {
            throw new RuntimeException('Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env before seeding.');
        }

        $superAdmin = User::firstOrNew(['email' => $email]);

        if (! $superAdmin->exists) {
            $superAdmin->forceFill([
                'name' => config('app.super_admin.name'),
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ])->save();
        }

        $superAdmin->assignRole(RoleEnum::SuperAdmin);
    }
}
