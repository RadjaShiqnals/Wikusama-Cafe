<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;


class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['apilogin', 'apiregister']]);
    }
    public function apiregister(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:users'],
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'role' => ['required', 'string', 'in:admin,kasir,manajer'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            if ($user) {
                return response()->json([
                    'message' => 'User created successfully',
                    'user' => $user
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Failed to create user'
                ], 400);
            }
        } catch (\Exception $e) {
            \Log::error('User registration failed', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function apilogin(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'message' => 'Unauthorized',
                'error' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'token' => $token
        ], 200);
    }
    public function apigetuser(Request $request)
    {
        $user = User::all();

        return response()->json([
            'user' => $user
        ], 200);
    }
    public function apilogout(Request $request)
    {
        try {
            // Get the current authenticated user token to invalidate to prevent further uses after logout.
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'message' => 'Successfully logged out',
            ]);
        } catch (JWTException $e) {
            // Catch any errors during token invalidation process
            return response()->json(['error' => 'Failed to logout, please try again'], 500);
        }
    }
}