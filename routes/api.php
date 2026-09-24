<?php

use App\Http\Controllers\Api\ZKTecoController;
use Illuminate\Support\Facades\Route;

Route::prefix('iclock')->group(function () {
    Route::get('cdata', [ZKTecoController::class, 'init']);
    Route::post('cdata', [ZKTecoController::class, 'push']);
    Route::get('getrequest', [ZKTecoController::class, 'getRequest']);
    Route::post('devicecmd', [ZKTecoController::class, 'deviceCmd']);
});
