<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\MenuModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\MejaModel;
use Illuminate\Contracts\Auth\Guard;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Create a new user with role
    public function createUser(Request $request)
{
    $user = Auth::guard('api')->user();
    // Role check
    if (!$user || $user->role !== 'admin') {
        return response()->json(['message' => 'Access denied'], 403);
    } else {
        $request->validate([
            'name' => 'required|unique:users,name,NULL,id,deleted_at,NULL',
            'username' => 'required',
            'email' => 'required|email|unique:users,email,NULL,id,deleted_at,NULL',
            'password' => 'required|confirmed',
            'role' => 'required|in:admin,kasir,manajer',
        ]);

        // Check if a soft-deleted user exists with the same email
        $existingUser = User::withTrashed()
            ->where('email', $request->email)
            ->orWhere('name', $request->name)
            ->first();

        if ($existingUser && $existingUser->trashed()) {
            // Restore the soft-deleted user
            $existingUser->restore();
            $existingUser->update([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            return response()->json([
                'message' => 'User restored and updated successfully',
                'user' => $existingUser
            ], 200);
        } else {
            // Create a new user
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user
            ], 201);
        }
    }
}

    public function getAllUsers(Request $request)
    {
        $user = Auth::guard('api')->user();
        // Role check
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $users = User::all();

            return response()->json(['users' => $users], 200);
        }
    }

    public function updateUser(Request $request, $id)
    {
        $user = Auth::guard('api')->user();
        // Role check
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $request->validate([
                'name' => 'required',
                'username' => 'required|unique:users,username,' . $id . ',id_user',
                'email' => 'required|email|unique:users,email,' . $id . ',id_user',
                'password' => 'nullable|confirmed',
                'role' => 'required|in:admin,kasir,manajer',
            ]);
    
            $user = User::findOrFail($id);
            $user->name = $request->name;
            $user->username = $request->username;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->role = $request->role;
            $user->save();
    
            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user
            ], 200);
        }
    }

    public function deleteUser(Request $request, $id)
    {
        $user = Auth::guard('api')->user();
        // Role check
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        } elseif ($user->id_user == $id) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        } else {
            $userToDelete = User::findOrFail($id);
            $userToDelete->delete();

            return response()->json(['message' => 'User deleted successfully'], 200);
        }
    }
    // Create a new menu item
    public function createMenu(Request $request)
    {
        $user = Auth::guard('api')->user();
        
        // Check if the authenticated user has the role "admin"
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $request->validate([
                'nama_menu' => 'required',
                'jenis' => 'required|in:makanan,minuman',
                'deskripsi' => 'required',
                'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'harga' => 'required|numeric',
            ]);

            // Check if a soft-deleted menu exists with the same name
            $existingMenu = MenuModel::withTrashed()
                ->where('nama_menu', $request->nama_menu)
                ->first();

            if ($existingMenu && $existingMenu->trashed()) {
                // Restore the soft-deleted menu
                $existingMenu->restore();
                $existingMenu->update([
                    'jenis' => $request->jenis,
                    'deskripsi' => $request->deskripsi,
                    'harga' => $request->harga,
                ]);

                // Handle image upload
                if ($request->hasFile('gambar')) {
                    $image = $request->file('gambar');
                    $imageName = $image->getClientOriginalName();
                    $imagePath = $image->storeAs('images/menu', $imageName, 'public');
                    $existingMenu->update(['gambar' => $imagePath]);
                }

                return response()->json([
                    'message' => 'Menu restored and updated successfully',
                    'menu' => $existingMenu
                ], 200);
            } else {
                // Handle image upload
                if ($request->hasFile('gambar')) {
                    $image = $request->file('gambar');
                    $imageName = $image->getClientOriginalName();
                    $imagePath = $image->storeAs('images/menu', $imageName, 'public');
                }

                // Create a new menu
                $menu = MenuModel::create([
                    'nama_menu' => $request->nama_menu,
                    'jenis' => $request->jenis,
                    'deskripsi' => $request->deskripsi,
                    'gambar' => $imagePath,
                    'harga' => $request->harga,
                ]);

                return response()->json([
                    'message' => 'Menu created successfully',
                    'menu' => $menu
                ], 201);
            }
        }
    }

public function editMenu(Request $request)
{
    // Get the authenticated user
    $user = Auth::guard('api')->user();
    
    // Check if the authenticated user has the role "admin"
    if ($user->role !== 'admin') {
        return response()->json(['message' => 'Access denied'], 403);
    } else {
        $request->validate([
            'id_menu' => 'required',
            'nama_menu' => 'required',
            'jenis' => 'required|in:makanan,minuman',
            'deskripsi' => 'required',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'harga' => 'required|numeric',
        ]);

        $menu = MenuModel::findOrFail($request->id_menu);

        // Handle image upload
        if ($request->hasFile('gambar')) {
            $image = $request->file('gambar');
            $imageName = $image->getClientOriginalName();
            $imagePath = $image->storeAs('images/menu', $imageName, 'public');
            $menu->gambar = $imagePath;
        }

        $menu->nama_menu = $request->nama_menu;
        $menu->jenis = $request->jenis;
        $menu->deskripsi = $request->deskripsi;
        $menu->harga = $request->harga;
        $menu->save();

        return response()->json([
            'message' => 'Menu updated successfully',
            'menu' => $menu
        ], 200);
    }
}

public function deleteMenu(Request $request, $id)
{
    // Get the authenticated user
    $user = Auth::guard('api')->user();
    
    // Check if the authenticated user has the role "admin"
    if ($user->role !== 'admin') {
        return response()->json(['message' => 'Access denied'], 403);
    } else {
        $menu = MenuModel::findOrFail($id);
        $menu->delete();

        return response()->json(['message' => 'Menu deleted successfully'], 200);
    }
}

    public function getMeja(Request $request, Guard $auth)
    {
        $user = Auth::guard('api')->user();

        // Check if the authenticated user has the role "admin"
        if ($user->role == 'admin') {
            $meja = MejaModel::orderBy('nomor_meja', 'asc')->get();
            return response()->json([
                'meja' => $meja
            ], 200);
        } else {
            // Logic for other roles
            return response()->json(['message' => 'You do not have access as a kasir'], 403);
        }

    }

    public function deleteMeja(Request $request, $id)
    {
        $user = Auth::guard('api')->user();

        // Check if the authenticated user has the role "admin"
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $meja = MejaModel::findOrFail($id);

            if ($meja->status == 'used') {
                return response()->json(['message' => 'Meja is currently being used'], 403);
            } else {
                $meja->delete();
            }

            return response()->json(['message' => 'Meja deleted successfully'], 200);
        }
    }

    public function editMeja(Request $request, $id)
{
    $user = Auth::guard('api')->user();

    // Check if the authenticated user has the role "admin"
    if ($user->role !== 'admin') {
        return response()->json(['message' => 'Access denied'], 403);
    } else {
        $request->validate([
            'nomor_meja' => 'required|unique:meja,nomor_meja,' . $id,
            'status' => 'nullable|in:available,used',
        ]);

        $meja = MejaModel::findOrFail($id);

        if ($meja->status !== 'used') {
            $meja->nomor_meja = $request->nomor_meja;
        }

        if ($request->status) {
            $meja->status = $request->status;
        }

        $meja->save();

        return response()->json([
            'message' => 'Meja updated successfully',
            'meja' => $meja
        ], 200);
    }
}

public function createMeja(Request $request)
{
    $user = Auth::guard('api')->user();

    // Check if the authenticated user has the role "admin"
    if ($user->role !== 'admin') {
        return response()->json(['message' => 'Access denied'], 403);
    } else {
        $request->validate([
            'nomor_meja' => 'required|unique:meja,nomor_meja,NULL,id,deleted_at,NULL',
        ]);

        // Check if a soft-deleted meja exists with the same nomor_meja
        $existingMeja = MejaModel::withTrashed()
            ->where('nomor_meja', $request->nomor_meja)
            ->first();

        if ($existingMeja && $existingMeja->trashed()) {
            // Restore the soft-deleted meja
            $existingMeja->restore();
            $existingMeja->update([
                'status' => 'available',
            ]);

            return response()->json([
                'message' => 'Meja restored and updated successfully',
                'meja' => $existingMeja
            ], 200);
        } else {
            // Create a new meja
            $meja = MejaModel::create([
                'nomor_meja' => $request->nomor_meja,
                'status' => 'available',
            ]);

            return response()->json([
                'message' => 'Meja created successfully',
                'meja' => $meja
            ], 201);
        }
    }
}

    public function getMenu(Request $request)
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
