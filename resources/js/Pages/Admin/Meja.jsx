import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Meja() {
    const { data, setData, post, put, errors, reset } = useForm({
        nomor_meja: '',
        status: 'available',
    });

    const [meja, setMeja] = useState([]);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMeja, setSelectedMeja] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchMeja();
    }, []);

    const fetchMeja = async () => {
        try {
            const response = await axios.get('/api/admin/get-meja', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });
            setMeja(response.data.meja);
        } catch (error) {
            console.error("There was an error fetching the meja data!", error);
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/create-meja', {
                nomor_meja: data.nomor_meja,
                status: "available",
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccessMessage('Meja created successfully');
            setErrorMessage(null);
            fetchMeja();
            setIsCreateModalOpen(false);
            reset();
            setValidationErrors({});
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                setErrorMessage(error.response.data.message);
                setIsCreateModalOpen(false);
                console.error("There was an error creating the meja!", error);
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/edit-meja/${selectedMeja.id_meja}`, {
                nomor_meja: data.nomor_meja,
                status: data.status,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccessMessage('Meja updated successfully');
            setErrorMessage(null);
            fetchMeja();
            setIsEditModalOpen(false);
            reset();
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrorMessage(error.response.data.errors);
            } else {
                setErrorMessage(error.response.data.message);
                setIsEditModalOpen(false);
                console.error("There was an error updating the meja!", error);
            }
        }
    };

    const handleDeleteMeja = async (id_meja) => {
        try {
            await axios.delete(`/api/admin/delete-meja/${id_meja}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });
            setSuccessMessage('Meja deleted successfully');
            setErrorMessage(null);
            fetchMeja();
        } catch (error) {
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('There was an error deleting the meja!');
            }
            console.error("There was an error deleting the meja!", error);
        }
    };

    const openEditModal = (meja) => {
        setSelectedMeja(meja);
        setData({
            nomor_meja: meja.nomor_meja,
            status: meja.status,
        });
        setIsEditModalOpen(true);
    };

    return (
        <AuthenticatedLayout
        header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Meja</h2>}
>
            <Head title="Manage Table" />
            <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-dark-form">
                    <div className="container mx-auto p-4">
                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-light-primary hover:bg-light-primary_hover text-white px-4 py-2 rounded"
                            >
                                Create Meja
                            </button>
                        </div>

                        {successMessage && (
                                <div className="text-green-500 mb-4">{successMessage}</div>
                            )}
                            {errorMessage && (
                                <div className="text-red-500 mb-4">{errorMessage}</div>
                            )}

                        <table className="min-w-full bg-white text-black dark:text-white dark:bg-dark-form text-center">
                            <thead>
                                <tr>
                                    <th className="py-2">Nomor Meja</th>
                                    <th className="py-2">Status</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meja.map((meja) => (
                                    <tr key={meja.id_meja}>
                                        <td className="px-4 py-2">{meja.nomor_meja}</td>
                                        <td className="px-4 py-2">{meja.status}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => openEditModal(meja)}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMeja(meja.id_meja)}
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {isCreateModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg">
                                    <h2 className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-4">Create Meja</h2>
                                    <form onSubmit={handleCreateSubmit}>
                                        <div className="mb-4">
                                            <label className="text-gray-900 dark:text-gray-100">Nomor Meja</label>
                                            <input
                                                type="text"
                                                value={data.nomor_meja}
                                                onChange={(e) => setData('nomor_meja', e.target.value)}
                                                className="w-full p-2 border rounded bg-white dark:bg-dark-form text-gray-900 dark:text-gray-100"
                                            />
                                            {validationErrors.nomor_meja && (
                                                <div className="text-red-500">{validationErrors.nomor_meja}</div>
                                            )}
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setIsCreateModalOpen(false)}
                                                className="bg-light-secondary hover:bg-light-accent text-white px-4 py-2 rounded mr-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-light-primary hover:bg-light-primary_hover text-white px-4 py-2 rounded"
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
                                <div className="bg-white dark:bg-dark-form p-4 rounded">
                                    <h2 className="text-xl font-bold mb-4 dark:text-gray-200">Edit Meja</h2>
                                    <form onSubmit={handleEditSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 dark:text-gray-200">Nomor Meja</label>
                                            <input
                                                type="text"
                                                value={data.nomor_meja}
                                                onChange={(e) => setData('nomor_meja', e.target.value)}
                                                className="dark:text-gray-200 w-full p-2 border rounded dark:bg-dark-form  "
                                            />
                                            {validationErrors.nomor_meja && (
                                                <div className="text-red-500">{validationErrors.nomor_meja}</div>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700  dark:text-gray-200">Status</label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                                className="w-full p-2 border rounded dark:bg-dark-form dark:text-gray-200"
                                            >
                                                <option value="available">Available</option>
                                                <option value="used">Used</option>
                                            </select>
                                            {validationErrors.status && (
                                                <div className="text-red-500">{validationErrors.status}</div>
                                            )}
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setIsEditModalOpen(false)}
                                                className="bg-light-secondary hover:bg-light-accent text-white px-4 py-2 rounded mr-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-light-primary hover:bg-light-primary_hover text-white px-4 py-2 rounded"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </AuthenticatedLayout>
    );
}