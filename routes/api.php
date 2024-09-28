<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\KasirController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ManajerController;
use App\Http\Controllers\User\AdminController;

// Auth API
Route::post('/user/register', [AuthController::class, 'apiregister']);
Route::post('/user/login', [AuthController::class, 'apilogin']);
Route::post('/user/logout', [AuthController::class, 'apilogout']);
Route::get('/getuser', [AuthController::class, 'apigetuser']);

// Kasir API
Route::get('/kasir/access', [KasirController::class, 'index']);
Route::post('/kasir/create-transaksi', [KasirController::class, 'apicreatetransaksi']);
Route::post('/kasir/bayar-transaksi', [KasirController::class, 'apipaytransaction']);
Route::get('/kasir/get-all-transaksi', [KasirController::class, 'apiseetransaction']);

// Manajer API
Route::get('/manajer/get-all-transaksi/{id}', [ManajerController::class, 'getTransactionsByUserId']);
Route::get('/manajer/get-all-transaksi', [ManajerController::class, 'getAllTransactions']);
Route::get('/manajer/get-transaksi/{date}/{hour?}', [ManajerController::class, 'getTransactionsByDate']);

// Admin API
Route::post('/admin/create-user', [AdminController::class, 'createUser']);
Route::get('/admin/get-all-user', [AdminController::class, 'getAllUsers']);
Route::put('/admin/update-user/{id}', [AdminController::class, 'updateUser']);
Route::delete('/admin/delete-user/{id}', [AdminController::class, 'deleteUser']);

// Other API
Route::get('/kasir/getmeja', [KasirController::class, 'getMeja']);
Route::get('/kasir/getmenu', [KasirController::class, 'getMenu']);