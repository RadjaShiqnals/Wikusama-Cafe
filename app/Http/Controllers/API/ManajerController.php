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
        if ($user->role == 'manajer') {
            // Logic for kasir role
            return response()->json(['message' => 'You have access as a manager']);
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a manager'], 403);
        }
    }

    public function getTransactionsByUserId($id_user)
    {
        $user = Auth::user();

        // Check if the authenticated user has the role "manajer"
        if ($user->role == 'manajer') {
            $transactions = TransaksiModel::where('id_user', $id_user)->get();
            return response()->json(['transactions' => $transactions]);
        } else {
            return response()->json(['message' => 'You do not have access as a manager'], 403);
        }
    }
    public function getAllTransactions()
    {
        $user = Auth::user();

        // Check if the authenticated user has the role "manajer"
        if ($user->role == 'manajer') {
            $transactions = TransaksiModel::all();
            return response()->json(['transactions' => $transactions]);
        } else {
            return response()->json(['message' => 'You do not have access as a manager'], 403);
        }
    }

    public function getTransactionsByDate($date, $hour = null)
{
    $user = Auth::user();

    if ($user->role != 'manajer') {
        return response()->json(['message' => 'You do not have access as a manager'], 403);
    }

    $query = TransaksiModel::query();

    if ($date) {
        $query->whereDate('created_at', $date);
    }

    if ($hour) {
        $query->whereTime('created_at', '=', $hour);
    }

    $transactions = $query->get();

    return response()->json(['transactions' => $transactions]);
}
}
