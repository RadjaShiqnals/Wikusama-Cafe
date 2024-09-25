<?php

use App\Http\Controllers\API\KasirController;
use App\Http\Controllers\API\ManajerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/user/register', [AuthController::class, 'apiregister']);
Route::post('/user/login', [AuthController::class, 'apilogin']);
Route::post('/user/logout', [AuthController::class, 'apilogout']);
Route::get('/getuser', [AuthController::class, 'apigetuser']);

Route::get('/kasir/access', [KasirController::class, 'index'])->middleware('auth:api');
Route::post('/kasir/create-transaksi', [KasirController::class, 'apicreatetransaksi']);
Route::post('/kasir/bayar-transaksi', [KasirController::class, 'apipaytransaction']);
Route::get('/kasir/get-all-transaksi', [KasirController::class, 'apiseetransaction']);
Route::get('/kasir/transaction-note/{id}', [KasirController::class, 'generateTransactionNotePdf']);

Route::get('/manajer/get-all-transaksi/{id}', [ManajerController::class, 'getTransactionsByUserId']);
Route::get('/manajer/get-all-transaksi', [ManajerController::class, 'getAllTransactions']);
Route::get('/manajer/get-transaksi/{date}/{hour?}', [ManajerController::class, 'getTransactionsByDate']);

Route::post('/admin/create-user', [AdminController::class, 'createUser']);
Route::get('/admin/get-all-user', [AdminController::class, 'getAllUsers']);
Route::put('/admin/update-user/{id}', [AdminController::class, 'updateUser']);
Route::delete('/admin/delete-user/{id}', [AdminController::class, 'deleteUser']);