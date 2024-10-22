import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function User() {
    const { data, setData, post, put, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'kasir',
    });

    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/admin/get-all-users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });
            setUsers(response.data.users);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/create-user', {
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                role: data.role,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccessMessage('User created successfully');
            fetchUsers();
            setIsCreateModalOpen(false);
            reset();
            setValidationErrors({});
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                console.error("There was an error creating the user!", error);
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/update-user/${selectedUser.id_user}`, {
                name: data.name,
                username: data.username,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                role: data.role,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
                onSuccess: () => {
                    setSuccessMessage('User updated successfully');
                    fetchUsers();
                    setIsEditModalOpen(false);
                    reset();
                },
                onError: (errors) => {
                    if (errors.response && errors.response.data.errors) {
                        setErrorMessage(errors.response.data.message);
                    } else {
                        console.error(errors);
                    }
                }
            });
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrorMessage(error.response.data.message);
            } else {
                console.error("There was an error updating the user!", error);
            }
        }
    };
    const handleDeleteUser = async (id) => {
        try {
            const response = await axios.delete(`/api/admin/delete-user/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });
            setSuccessMessage('User deleted successfully');
            fetchUsers();
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred');
            }
            console.error("There was an error deleting the user!", error);
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setData({
            name: user.name,
            username: user.username,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role,
        });
        setIsEditModalOpen(true);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Users</h2>}
        >
            <Head title="Manage Users" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-dark-form">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {successMessage && (
                                <div className="text-green-500 mb-4">{successMessage}</div>
                            )}
                            {errorMessage && (
                                <div className="text-red-500 mb-4">{errorMessage}</div>
                            )}
                            <button
                                className="bg-light-primary hover:bg-light-primary_hover text-white font-bold py-2 px-4 rounded mb-4"
                                onClick={() => setIsCreateModalOpen(true)}
                            >
                                Create User
                            </button>
                            <table className="min-w-full bg-white dark:bg-dark-form text-center">
                                <thead>
                                    <tr>
                                        <th className="py-2">Name</th>
                                        <th className="py-2">Username</th>
                                        <th className="py-2">Email</th>
                                        <th className="py-2">Role</th>
                                        <th className="py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id_user}>
                                            <td className="py-2">{user.name}</td>
                                            <td className="py-2">{user.username}</td>
                                            <td className="py-2">{user.email}</td>
                                            <td className="py-2">{user.role}</td>
                                            <td className="py-2">
                                                <button
                                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                    onClick={() => handleDeleteUser(user.id_user)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Create User</h3>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="mt-4">
                                <label htmlFor="name" className="text-gray-900 dark:text-gray-100">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.name && <div className="text-red-500 dark:text-red-400">{validationErrors.name[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="username" className="text-gray-900 dark:text-gray-100">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.username && <div className="text-red-500 dark:text-red-400">{validationErrors.username[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.email && <div className="text-red-500 dark:text-red-400">{validationErrors.email[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="password" className="text-gray-900 dark:text-gray-100">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.password && <div className="text-red-500 dark:text-red-400">{validationErrors.password[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="password_confirmation" className="text-gray-900 dark:text-gray-100">Confirm Password</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.password_confirmation && <div className="text-red-500 dark:text-red-400">{validationErrors.password_confirmation[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="role" className="text-gray-900 dark:text-gray-100">Role</label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="kasir">Kasir</option>
                                    <option value="manajer">Manajer</option>
                                </select>
                                {validationErrors.role && <div className="text-red-500 dark:text-red-400">{validationErrors.role[0]}</div>}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-light-secondary hover:bg-light-accent text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => setIsCreateModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-light-primary hover:bg-light-primary_hover text-white font-bold py-2 px-4 rounded"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Edit User</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mt-4">
                                <label htmlFor="name" className="text-gray-900 dark:text-gray-100">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.name && <div className="text-red-500 dark:text-red-400">{validationErrors.name[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="username" className="text-gray-900 dark:text-gray-100">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.username && <div className="text-red-500 dark:text-red-400">{validationErrors.username[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.email && <div className="text-red-500 dark:text-red-400">{validationErrors.email[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="password" className="text-gray-900 dark:text-gray-100">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.password && <div className="text-red-500 dark:text-red-400">{validationErrors.password[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="password_confirmation" className="text-gray-900 dark:text-gray-100">Confirm Password</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {validationErrors.password_confirmation && <div className="text-red-500 dark:text-red-400">{validationErrors.password_confirmation[0]}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="role" className="text-gray-900 dark:text-gray-100">Role</label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="kasir">Kasir</option>
                                    <option value="manajer">Manajer</option>
                                </select>
                                {validationErrors.role && <div className="text-red-500 dark:text-red-400">{validationErrors.role[0]}</div>}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-light-secondary hover:bg-light-accent text-white font-bold py-2 px-4 rounded mr-2"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-light-primary hover:bg-light-primary_hover text-white font-bold py-2 px-4 rounded"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}