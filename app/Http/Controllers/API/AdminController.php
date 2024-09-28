<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class AdminController extends Controller
{
    // Create a new user with role
    public function createUser(Request $request)
    {
        // Role check
        if ($request->user()->role !== 'admin') {
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
        // Role check
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $users = User::all();

            return response()->json(['users' => $users], 200);
        }
    }

    public function updateUser(Request $request, $id)
    {
        // Role check
        if ($request->user()->role !== 'admin') {
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
        // Role check
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        } else {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json(['message' => 'User deleted successfully'], 200);
        }
    }
}
