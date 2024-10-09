<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\User\AdminController;
use App\Http\Controllers\User\KasirController;
use App\Http\Controllers\User\ManajerController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\API\KasirController as Meja;

Route::get('/', function () {
    return redirect()->route('login');
    
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
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

// Admin Route
Route::middleware('auth')->group(function () {
    Route::get('/admin/dashboard', function () {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        return app(AdminController::class)->index();
    })->name('admin.dashboard');
    Route::get('/admin/user', function () {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }
        return app(AdminController::class)->user();
    })->name('admin.user');
});

// Kasir Route
Route::middleware('auth')->group(function () {
    Route::get('/kasir/dashboard', function () {
        $user = Auth::user();
        if ($user->role !== 'kasir') {
            abort(403, 'Unauthorized action.');
        }
        return app(KasirController::class)->index();
    })->name('kasir.dashboard');
    Route::get('/kasir/send-payment', function () {
        $user = Auth::user();
        if ($user->role !== 'kasir') {
            abort(403, 'Unauthorized action.');
        }
        return app(KasirController::class)->createTransaksi();
    })->name('kasir.sendpayment');
    
    Route::get('/kasir/see-transaksi', function () {
        $user = Auth::user();
        if ($user->role !== 'kasir') {
            abort(403, 'Unauthorized action.');
        }
        return app(KasirController::class)->seeTransaksi();
    })->name('kasir.seetransaksi');

    Route::get('/kasir/see-detail-transaksi', function () {
        $user = Auth::user();
        if ($user->role !== 'kasir') {
            abort(403, 'Unauthorized action.');
        }
        return app(KasirController::class)->seeDetailTransaksi();
    })->name('kasir.seedetailtransaksi');
    
});

// Manajer Route
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
