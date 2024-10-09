import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

// UUID validation function
const isValidUUID = (uuid) => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
};

function SendPayment() {
    const user = usePage().props.auth.user;
    const [transactionId, setTransactionId] = useState('');
    const [transactionData, setTransactionData] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (isValidUUID(transactionId)) {
                setTransactionData(null);
                setError('');
                setMessage('');

                try {
                    const response = await axios.post('/api/kasir/get-transaksi', {
                        id_transaksi: transactionId,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    setTransactionData(response.data.transaction);
                } catch (err) {
                    if (err.response) {
                        setError(err.response.data.message);
                    } else {
                        setError('An error occurred while fetching the transaction data.');
                    }
                }
            } else {
                setTransactionData(null);
                setError('Invalid UUID format.');
            }
        };

        fetchTransactionDetails();
    }, [transactionId]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.post('/api/kasir/bayar-transaksi', {
                id_transaksi: transactionId,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setMessage(response.data.message);
            setTransactionData(null);
            setTransactionId('');
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred while processing the payment.');
            }
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Kasir Dashboard</h2>}
        >
            <Head title="Kasir Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Welcome, {user.username} | {user.role}
                            <div className="block my-4"></div>

                            <form onSubmit={handlePayment}>
                                <div>
                                    <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Transaction ID
                                    </label>
                                    <input
                                        type="text"
                                        id="transactionId"
                                        name="transactionId"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Pay Transaction
                                    </button>
                                </div>
                            </form>

                            {transactionData && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Transaction Details</h3>
                                    <p><strong>Pembuat Transaksi:</strong> {transactionData['Pembuat Transaksi']}</p>
                                    <p><strong>Nomor Meja:</strong> {transactionData['Nomor Meja']}</p>
                                    <p><strong>Nama Pelanggan:</strong> {transactionData['Nama Pelanggan']}</p>
                                    <p><strong>Status:</strong> {transactionData['Status']}</p>
                                    <h4 className="mt-2 text-md font-medium text-gray-900 dark:text-gray-100">Menu</h4>
                                    <ul>
                                        {transactionData['Menu'].map((menu, index) => (
                                            <li key={index}>
                                                <p><strong>ID Menu:</strong> {menu.id_menu}</p>
                                                <p><strong>Nama Menu:</strong> {menu.nama_menu}</p>
                                                <p><strong>Harga:</strong> {menu.harga}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {message && <div className="mt-4 text-green-500">{message}</div>}
                            {error && <div className="mt-4 text-red-500">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default SendPayment;