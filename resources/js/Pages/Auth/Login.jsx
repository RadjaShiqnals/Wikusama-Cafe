import React, { useState } from "react";
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Login({ status, canResetPassword }) {
    const [message, setMessage] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        password: '',
        remember: false,
    });

    const submit = async (e) => {
        e.preventDefault();

        try {
            // Check if there is an existing token
            const existingToken = localStorage.getItem("token");
            if (existingToken) {
                // Remove the existing token
                localStorage.removeItem("token");
            }
            // Make the login request
            const response = await axios.post(route("login"), {
                name: data.name,
                password: data.password,
                remember: data.remember,
            });

            // Check if the response contains the token
            if (response.data.token) {
                // Store the token in local storage
                localStorage.setItem("token", response.data.token);
                // Redirect to the dashboard
                window.location.href = "/dashboard";
            } else {
                console.error("Token not found in response");
            }
        } catch (error) {
            setMessage(error.response.data.message ?? error.response.data.error);
            console.error("Login failed", error);
        } finally {
            reset("password");
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {message && (
                <div className="mb-4 text-sm font-medium text-red-700">
                    {message}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-light-text underline hover:text-light-primary_hover focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}