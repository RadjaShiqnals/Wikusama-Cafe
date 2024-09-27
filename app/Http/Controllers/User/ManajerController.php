<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManajerController extends Controller
{
    public function index()
    {
        return Inertia::render('Manajer/Dashboard');
    }
}
