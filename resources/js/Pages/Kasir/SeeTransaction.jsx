import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function SeeTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Fetch transactions from the API
        axios.get('/api/kasir/get-all-transaksi', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setTransactions(response.data.transactions);
                console.log('Transactions:', response.data.transactions);
            })
            .catch(error => {
                setError('Failed to fetch transactions');
                console.error(error);
            });
    }, []);

    const handlePayTransaction = (id_transaksi) => {
        axios.post('/api/kasir/bayar-transaksi', { id_transaksi }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setMessage('Transaction paid successfully');
                // Update the transaction status in the state
                setTransactions(transactions.map(transaction =>
                    transaction.id_transaksi === id_transaksi ? { ...transaction, status: 'lunas' } : transaction
                ));
            })
            .catch(error => {
                setError('Failed to pay transaction');
                console.error(error);
            });
    };

    return (
        <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                Semua Data Transaksi
            </h2>
        }>
            <Head title="See Transactions" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            {message && <div className="text-green-500 mb-4">{message}</div>}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">ID Transaksi</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Username</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Nomor Meja</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Nama Pelanggan</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Status</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Tanggal</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Menu</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Harga</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(transaction => (
                                            <tr key={transaction.id_transaksi} className="bg-white dark:bg-gray-800">
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.id_transaksi}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.user_relations.name}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.meja_relations.nomor_meja}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.nama_pelanggan}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.status}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.tgl_transaksi}</td>
                                                <td className="py-2 px-4 border-b" colSpan="2">
                                                    <ul className="text-center text-gray-800 dark:text-gray-200">
                                                        {transaction.detail_transaksi_relations.map(detail => (
                                                            <li key={detail.id_detail_transaksi} className="flex justify-between items-center">
                                                                <span className="flex-1">{detail.menu_relations.nama_menu}</span>
                                                                <span className="flex-1 text-center">{detail.harga}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    {transaction.status !== 'lunas' && (
                                                        <button
                                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                            onClick={() => handlePayTransaction(transaction.id_transaksi)}
                                                        >
                                                            Pay
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}