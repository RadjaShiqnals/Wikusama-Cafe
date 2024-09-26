<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MejaModel;
use App\Models\TransaksiModel;
use App\Models\DetailTransaksiModel;
use App\Models\MenuModel;

class ManajerController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Check if the authenticated user has the role "kasir"
        if ($user->role == 'kasir') {
            // Logic for kasir role
            return response()->json(['message' => 'You have access as a kasir']);
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a kasir'], 403);
        }
    }
}
