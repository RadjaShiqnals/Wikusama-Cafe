<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\MejaModel;
use App\Models\TransaksiModel;
use App\Models\DetailTransaksiModel;
use App\Models\MenuModel;
use Dompdf\Dompdf;
use Dompdf\Options;

class ManajerController extends Controller
{
    public function index()
    {
        $user = Auth::guard('api')->user();

        // Check if the authenticated user has the role "kasir"
        if ($user->role == 'manajer') {
            // Logic for kasir role
            return response()->json(['message' => 'You have access as a manager']);
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a manager'], 403);
        }
    }

    public function getAllTransactions()
    {
        $user = Auth::guard('api')->user();

        // Check if the authenticated user has the role "manajer"
        if ($user->role == 'manajer') {

            $transactions = TransaksiModel::all();

            $transactions->load('userRelations', 'mejaRelations', 'detailTransaksiRelations.menuRelations');


            return response()->json(['transactions' => $transactions]);
        } else {
            return response()->json(['message' => 'You do not have access as a manager'], 403);
        }
    }

    public function getDetailTransaksi(Request $request, $id_transaksi)
    {
        // Get the authenticated user
        $user = Auth::guard('api')->user();
        // Check if the authenticated user has the role "kasir"
        if ($user->role == 'manajer') {
            $details = DetailTransaksiModel::getDetailTransaksiByTransaksiId($id_transaksi);

            return response()->json([
                'details' => $details,
            ]);
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a manajer'], 403);
        }
    }

    public function downloadPdf($id_transaksi)
    {
        // Get the authenticated user
        $user = Auth::guard('api')->user();
        // Check if the authenticated user has the role "kasir"
        if ($user->role == 'manajer') {
            // Get the transaction by ID
            $transaction = TransaksiModel::with(['userRelations', 'mejaRelations', 'detailTransaksiRelations.menuRelations'])
                ->find($id_transaksi);

            if (!$transaction) {
                return response()->json(['message' => 'Transaction not found'], 404);
            }

            // Prepare the data for the PDF
            $data = [
                'cafe_name' => 'Wikusama Cafe',
                'tgl_transaksi' => $transaction->tgl_transaksi,
                'nama_pelanggan' => $transaction->nama_pelanggan,
                'nomor_meja' => $transaction->mejaRelations->nomor_meja,
                'details' => $transaction->detailTransaksiRelations,
                'thanks_message' => 'Thank you for visiting Wikusama Cafe!',
            ];

            // Generate the PDF
            $options = new Options();
            $options->set('isHtml5ParserEnabled', true);
            $options->set('isRemoteEnabled', true);

            $dompdf = new Dompdf($options);
            $html = view('pdf.transaction', $data)->render();
            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'portrait');
            $dompdf->render();

            // Output the generated PDF to the browser
            return $dompdf->stream('transaction.pdf');
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a kasir'], 403);
        }
    }

    public function getTransactionsByDate($date, $hour = null)
{
    $user = Auth::guard('api')->user();

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
public function getUsers(Request $request)
    {
        $user = Auth::guard('api')->user();

        // Check if the authenticated user has the role "admin"
        if ($user->role == 'admin') {
            $menu = MenuModel::all();
            return response()->json([
                'menu' => $menu
            ], 200);
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a kasir'], 403);
        }

    }
}
