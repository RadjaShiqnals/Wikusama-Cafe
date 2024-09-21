<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/user/register', [AuthController::class, 'userregister']);
Route::post('/user/login', [AuthController::class, 'userlogin']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/user/logout', [AuthController::class, 'userlogout']);
});
Route::get('/getuser', [AuthController::class, 'getUser']);
