<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\KasirController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ManajerController;
use App\Http\Controllers\API\AdminController;

// Auth API
Route::post('/user/register', [AuthController::class, 'apiregister']);
Route::post('/user/login', [AuthController::class, 'apilogin']);
Route::post('/user/logout', [AuthController::class, 'apilogout']);
Route::get('/getuser', [AuthController::class, 'apigetuser']);

// Kasir API
Route::get('/kasir/access', [KasirController::class, 'index']);
Route::post('/kasir/create-transaksi', [KasirController::class, 'apicreatetransaksi']);
Route::post('/kasir/bayar-transaksi', [KasirController::class, 'apipaytransaction']);
Route::post('/kasir/get-transaksi', [KasirController::class, 'apigettransaction']);
Route::get('/kasir/get-all-transaksi', [KasirController::class, 'apiseetransaction']);
Route::get('/kasir/get-detail-transaksi/{id_transaksi}', [KasirController::class, 'getDetailTransaksi']);
Route::get('/kasir/download-pdf/{id_transaksi}', [KasirController::class, 'downloadPdf']);
Route::get('/kasir/getmeja', [KasirController::class, 'getMeja']);
Route::get('/kasir/getmenu', [KasirController::class, 'getMenu']);

// Manajer API
Route::get('/manajer/get-all-transaksi/{id}', [ManajerController::class, 'getTransactionsByUserId']);
Route::get('/manajer/get-all-transaksi', [ManajerController::class, 'getAllTransactions']);
Route::get('/manajer/get-detail-transaksi/{id}', [ManajerController::class, 'getDetailTransaksi']);
Route::get('/manajer/download-pdf/{id}', [ManajerController::class, 'downloadPdf']);
Route::get('/manajer/get-transaksi/{date}/{hour?}', [ManajerController::class, 'getTransactionsByDate']);

// Admin API
Route::post('/admin/create-user', [AdminController::class, 'createUser']);
Route::get('/admin/get-all-users', [AdminController::class, 'getAllUsers']);
Route::put('/admin/update-user/{id}', [AdminController::class, 'updateUser']);
Route::delete('/admin/delete-user/{id}', [AdminController::class, 'deleteUser']);
Route::post('/admin/create-menu', [AdminController::class, 'createMenu']);
Route::put('/admin/edit-menu', [AdminController::class, 'editMenu']);
Route::delete('/admin/delete-menu/{id}', [AdminController::class, 'deleteMenu']);
Route::get('/admin/get-meja', [AdminController::class, 'getMeja']);
Route::get('/admin/create-meja', [AdminController::class, 'createMeja']);
Route::get('/admin/edit-meja/{id}', [AdminController::class, 'editMeja']);
Route::get('/admin/delete-meja/{id}', [AdminController::class, 'deleteMeja']);
Route::get('/admin/getmenu', [AdminController::class, 'getMenu']);

// Other API
