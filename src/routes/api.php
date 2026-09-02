<?php

use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LineItemController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('clients', ClientController::class);
    Route::apiResource('clients.projects', ProjectController::class)->shallow();
    Route::apiResource('projects.invoices', InvoiceController::class)->shallow();
    Route::apiResource('invoices.line-items', LineItemController::class)
        ->shallow()
        ->parameters(['line-items' => 'line_item']);
});
