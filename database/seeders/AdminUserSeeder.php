<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'demoadmin01',
            'username' => 'demoadmin01username',
            'email' => 'demoadmin01@gmail.com',
            'password' => Hash::make('demoadmin01'),
            'role' => 'admin',
        ]);
    }
}
