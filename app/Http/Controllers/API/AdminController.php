<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\MenuModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    // Create a new user with role
    public function createUser(Request $request)
    {
        $user = Auth::guard('api')->user();
        // Role check
        if ($user->role !== 'kasir') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $request->validate([
                'name' => 'required',
                'username' => 'required|unique:users',
                'email' => 'required|email|unique:users',
                'password' => 'required|confirmed',
                'role' => 'required',
            ]);

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

    public function getAllUsers(Request $request)
    {
        $user = Auth::guard('api')->user();
        // Role check
        if ($user->role !== 'kasir') {
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
        if ($user->role !== 'kasir') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $request->validate([
                'name' => 'required',
                'username' => 'required|unique:users,username,' . $id . ',id_user',
                'email' => 'required|email|unique:users,email,' . $id . ',id_user',
                'password' => 'required|confirmed',
                'role' => 'required|in:admin,kasir,manajer',
            ]);
    
            $user = User::findOrFail($id);
            $user->name = $request->name;
            $user->username = $request->username;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
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
        if ($user->role !== 'kasir') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json(['message' => 'User deleted successfully'], 200);
        }
    }
    // Create a new menu item
    public function createMenu(Request $request)
    {
        // Get the authenticated user
        $user = Auth::guard('api')->user();

        // Check if the authenticated user has the role "kasir"
        if ($user->role !== 'kasir') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $request->validate([
                'nama_menu' => 'required',
                'jenis' => 'required|in:makanan,minuman',
                'deskripsi' => 'required',
                'gambar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'harga' => 'required|numeric',
            ]);

            // Handle image upload
            if ($request->hasFile('gambar')) {
                $image = $request->file('gambar');
                $imageName = $image->getClientOriginalName();
                $imagePath = $image->storeAs('images/menu', $imageName, 'public');
            }

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
