<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MejaModel;
use Illuminate\Http\Request;
use App\Models\TransaksiModel;
use App\Models\DetailTransaksiModel;
use App\Models\MenuModel;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Dompdf\Dompdf;
use Dompdf\Options;

class KasirController extends Controller
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
    public function generateTransactionNotePdf($transactionId)
{
    // Get the authenticated user
    $user = Auth::user();
    
    // Check if the authenticated user has the role "kasir"
    if ($user->role == 'kasir') {
        // Find the transaction by ID
        $transaction = TransaksiModel::find($transactionId);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        // Load relations
        $transaction->load('userRelations', 'detailTransaksiRelations.menuRelations', 'mejaRelations');

        // Prepare data for the PDF
        $data = [
            'cafe_name' => 'Wikusama Cafe',
            'transaction_date' => $transaction->tgl_transaksi,
            'cashier_name' => $transaction->userRelations->name,
            'meja' => $transaction->mejaRelations->nomor_meja,
            'details' => $transaction->detailTransaksiRelations
        ];

        // Generate HTML content for the PDF
        $html = view('pdf.transaction_note', $data)->render();

        // Initialize Dompdf
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $dompdf = new Dompdf($options);

        // Load HTML content
        $dompdf->loadHtml($html);

        // Set paper size and orientation
        $dompdf->setPaper('A4', 'portrait');

        // Render the PDF
        $dompdf->render();

        // Output the generated PDF to Browser
        return $dompdf->stream('transaction_note.pdf');
    } else {
        // Logic for other roles
        return response()->json(['message' => 'You do not have access as a kasir'], 403);
    }
}
    public function apicreatetransaksi(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();
        // Check if the authenticated user has the role "kasir"
        if ($user->role == 'kasir') {
            // Validation rules
            $validator = Validator::make($request->all(), [
                'id_meja' => 'required|exists:meja,id_meja',
                'nama_pelanggan' => 'required|string',
                'id_menu' => 'required|array',
                'id_menu.*' => 'exists:menu,id_menu',
            ]);
            // Check if validation fails
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            } else {
                // Check if the meja is already used
                $meja = MejaModel::find($request->id_meja);
                if ($meja->status == 'used') {
                    return response()->json(['message' => 'Meja is already used'], 400);
                } else {
                    $transaksi = TransaksiModel::create([
                        'tgl_transaksi' => now(),
                        'id_user' => auth()->user()->id_user,
                        'id_meja' => $request->id_meja,
                        'nama_pelanggan' => $request->nama_pelanggan,
                        'status' => 'belum_bayar',
                    ]);

                    // Update the status of the meja to "used"
                    $meja = MejaModel::find($request->id_meja);
                    $meja->status = 'used';
                    $meja->save();

                    // Get the id_transaksi from the newly created transaction
                    $id_transaksi = $transaksi->id_transaksi;

                    // Create detail transactions for each id_menu
                    $detailTransaksiList = [];
                    foreach ($request->id_menu as $id_menu) {
                        $menu = MenuModel::find($id_menu);
                        $detailTransaksi = DetailTransaksiModel::create([
                            'id_transaksi' => $id_transaksi,
                            'id_menu' => $id_menu,
                            'harga' => $menu->harga,
                        ]);
                        $detailTransaksiList[] = $detailTransaksi;
                    }

                    // Get the user relation for the transaction
                    $transaksi->load('userRelations');

                    // Get the menu relation for each detail transaction
                    foreach ($detailTransaksiList as $detailTransaksi) {
                        $detailTransaksi->load('menuRelations');
                    }

                    // Return the created transaction and detail transactions with relations
                    return response()->json([
                        'message' => 'Transaction created successfully',
                        'transaksi' => $transaksi,
                        'detailTransaksi' => $detailTransaksiList,
                        'meja' => $meja,
                    ]);
                }

            }
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a kasir'], 403);
        }
    }
    public function apipaytransaction(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();
        // Check if the authenticated user has the role "kasir"
        if ($user->role == 'kasir') {
            // Validation rules
            $validator = Validator::make($request->all(), [
                'id_transaksi' => ' required|exists:transaksi,id_transaksi',
            ]);
            // Check if validation fails
            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 400);
            } else {
                $transaksi = TransaksiModel::find($request->id_transaksi);

                // Check if the transaction status is already "lunas"
                if ($transaksi->status == 'lunas') {
                    return response()->json(['message' => 'Transaction is already paid'], 400);
                } else {
                    $transaksi->status = 'lunas';
                    $transaksi->save();

                    // Update the status of the meja to "available"
                    $meja = MejaModel::find($transaksi->id_meja);
                    $meja->status = 'available';
                    $meja->save();

                    return response()->json([
                        'message' => 'Transaction paid successfully',
                        'transaksi' => $transaksi,
                        'meja' => $meja,
                    ]);
                }
            }
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a kasir'], 403);
        }
    }
    public function apiseetransaction(Request $request)
    {
        // Get the authenticated user
        $user = Auth::user();
        // Check if the authenticated user has the role "kasir"
        if ($user->role == 'kasir') {
            // Get all transactions
            $transactions = TransaksiModel::all();

            // Load relations for each transaction
            foreach ($transactions as $transaction) {
                // Get the user relation for the transaction
                $transaction->load('userRelations');

                // Get the detail transactions relation for the transaction
                $transaction->load('detailTransaksiRelations');

                // Get the menu relation for each detail transaction
                foreach ($transaction->detailTransaksiRelations as $detailTransaksi) {
                    $detailTransaksi->load('menuRelations');
                }

                // Get the meja relation for the transaction
                $transaction->load('mejaRelations');
            }

            return response()->json([
                'message' => 'All transactions',
                'transactions' => $transactions,
            ]);
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a kasir'], 403);
        }
    }
}
