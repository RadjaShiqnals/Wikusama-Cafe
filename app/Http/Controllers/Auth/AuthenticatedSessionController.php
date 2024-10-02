<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Log;
use Illuminate\Http\JsonResponse;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): JsonResponse
    {
        // Authenticate the user using the 'web' guard
        if (!Auth::guard('web')->attempt($request->only('name', 'password'))) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        // Regenerate session to prevent fixation attacks
        $request->session()->regenerate();

        // Get the authenticated user
        $user = Auth::guard('web')->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Generate JWT token for the authenticated user
        $token = JWTAuth::fromUser($user);

        Log::info('User logged in', [
            'user' => $user,
            'token' => $token,
        ]);

        // Return the token in the response
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
