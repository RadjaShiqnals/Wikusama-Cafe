<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\User\AdminController;
use App\Http\Controllers\User\KasirController;
use App\Http\Controllers\User\ManajerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = Auth::user();

    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($user->role === 'kasir') {
        return redirect()->route('kasir.dashboard');
    } elseif ($user->role === 'manajer') {
        return redirect()->route('manajer.dashboard');
    }

    // Default fallback if no role matches
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/admin/dashboard', function () {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        return app(AdminController::class)->index();
    })->name('admin.dashboard');
    // Add more admin routes here
});

Route::middleware('auth')->group(function () {
    Route::get('/kasir/dashboard', function () {
        $user = Auth::user();
        if ($user->role !== 'kasir') {
            abort(403, 'Unauthorized action.');
        }
        return app(KasirController::class)->index();
    })->name('kasir.dashboard');
    // Add more kasir routes here
});

Route::middleware('auth')->group(function () {
    Route::get('/manajer/dashboard', function () {
        $user = Auth::user();
        if ($user->role !== 'manajer') {
            abort(403, 'Unauthorized action.');
        }
        return app(ManajerController::class)->index();
    })->name('manajer.dashboard');
    // Add more manajer routes here
});

require __DIR__.'/auth.php';
