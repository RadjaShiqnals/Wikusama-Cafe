<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\KasirController;
use App\Http\Controllers\API\AuthController;

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
