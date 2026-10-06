<?php

use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\LineItemController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\RazorpayWebhookController;
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

    Route::get('/invoices/{invoice}/payment-link', [InvoiceController::class, 'paymentLink']);
});

// Public payment flow — the entry point is signature-protected (see note above),
// the order/verify steps are protected by Razorpay's own cryptographic checks.
Route::get('/invoices/{invoice}/pay', [PaymentController::class, 'show'])
    ->name('invoices.pay.show')
    ->middleware('signed');

Route::post('/invoices/{invoice}/pay/order', [PaymentController::class, 'createOrder']);
Route::post('/invoices/{invoice}/pay/verify', [PaymentController::class, 'verify']);

// Razorpay calls this directly — verified via X-Razorpay-Signature header, not Sanctum
Route::post('/webhooks/razorpay', [RazorpayWebhookController::class, 'handle']);
