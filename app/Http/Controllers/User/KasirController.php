<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KasirController extends Controller
{
    public function index()
    {
        return Inertia::render('Kasir/Dashboard');
    }
    public function createTransaksi()
    {
        return Inertia::render('Kasir/SendPayment');
    }
    public function seeTransaksi()
    {
        return Inertia::render('Kasir/SeeTransaction');
    }
}
