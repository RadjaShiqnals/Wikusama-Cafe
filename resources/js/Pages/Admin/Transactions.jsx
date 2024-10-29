import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function Transactions() {
    const { data, setData, post, errors } = useForm({
        tgl_transaksi: '',
        nama_pelanggan: '',
        id_meja: '',
        status: 'paid'
    });

    const [transactionList, setTransactionList] = useState([]);
    const [filteredTransactionList, setFilteredTransactionList] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [kasirName, setKasirName] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [kasirName, fromDate, toDate, transactionList]);

    const fetchTransactions = () => {
        axios
            .get("/api/admin/get-all-transactions", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            .then((response) => {
                setTransactionList(response.data.transactions);
                setFilteredTransactionList(response.data.transactions);
            })
            .catch((error) => {
                console.error("There was an error fetching the transactions!", error);
            });
    };

    const applyFilters = () => {
        let filtered = transactionList;

        if (kasirName) {
            filtered = filtered.filter(transaction => transaction.user_relations.name.toLowerCase().includes(kasirName.toLowerCase()));
        }

        if (fromDate) {
            filtered = filtered.filter(transaction => new Date(transaction.tgl_transaksi) >= new Date(fromDate));
        }

        if (toDate) {
            filtered = filtered.filter(transaction => new Date(transaction.tgl_transaksi) <= new Date(toDate));
        }

        setFilteredTransactionList(filtered);
    };

    const handleEditClick = (transaction) => {
        setSelectedTransaction(transaction);
        setData({
            tgl_transaksi: transaction.tgl_transaksi,
            nama_pelanggan: transaction.nama_pelanggan,
            id_meja: transaction.id_meja,
            status: transaction.status
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (id_transaksi) => {
        try {
            const response = await axios.delete(`/api/admin/delete-transaction/${id_transaksi}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setTransactionList(transactionList.filter(transaction => transaction.id_transaksi !== id_transaksi));
            setSuccessMessage(response.data.message);
        } catch (error) {
            console.error("There was an error deleting the transaction!", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/admin/edit-transaction/${selectedTransaction.id_transaksi}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setSuccessMessage(response.data.message);
            setTransactionList(transactionList.map(transaction => transaction.id_transaksi === selectedTransaction.id_transaksi ? response.data.transaction : transaction));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("There was an error updating the transaction!", error);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manage Transactions</h2>}
        >
            <Head title="Manage Transactions" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-dark-form">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {successMessage && (
                                <div className="text-green-500 mb-4">{successMessage}</div>
                            )}
                            <div className="mb-4">
                                <label htmlFor="kasir_name" className="block text-gray-700 dark:text-gray-300">Kasir Name</label>
                                <input
                                    id="kasir_name"
                                    type="text"
                                    value={kasirName}
                                    onChange={(e) => setKasirName(e.target.value)}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="from_date" className="block text-gray-700 dark:text-gray-300">From Date</label>
                                <input
                                    id="from_date"
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="to_date" className="block text-gray-700 dark:text-gray-300">To Date</label>
                                <input
                                    id="to_date"
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="mt-1 block w-full"
                                />
                            </div>
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Transaction List</h3>
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kasir</th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Table</th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredTransactionList.map((transaction) => (
                                            <tr key={transaction.id_transaksi}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{transaction.tgl_transaksi}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.user_relations.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.nama_pelanggan}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {transaction.meja_relations ? transaction.meja_relations.nomor_meja : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{transaction.status}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                        onClick={() => handleEditClick(transaction)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                        onClick={() => handleDeleteClick(transaction.id_transaksi)}
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
            </div>
            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Edit Transaction</h3>
                        <form onSubmit={handleEditSubmit}>
                            <div className="mt-4">
                                <label htmlFor="tgl_transaksi" className="text-gray-900 dark:text-gray-100">Transaction Date</label>
                                <input
                                    id="tgl_transaksi"
                                    type="date"
                                    value={data.tgl_transaksi}
                                    onChange={(e) => setData('tgl_transaksi', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {errors.tgl_transaksi && <div className="text-red-500 dark:text-red-400">{errors.tgl_transaksi}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="nama_pelanggan" className="text-gray-900 dark:text-gray-100">Customer Name</label>
                                <input
                                    id="nama_pelanggan"
                                    type="text"
                                    value={data.nama_pelanggan}
                                    onChange={(e) => setData('nama_pelanggan', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {errors.nama_pelanggan && <div className="text-red-500 dark:text-red-400">{errors.nama_pelanggan}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="id_meja" className="text-gray-900 dark:text-gray-100">Table ID</label>
                                <input
                                    id="id_meja"
                                    type="text"
                                    value={data.id_meja}
                                    onChange={(e) => setData('id_meja', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                />
                                {errors.id_meja && <div className="text-red-500 dark:text-red-400">{errors.id_meja}</div>}
                            </div>
                            <div className="mt-4">
                                <label htmlFor="status" className="text-gray-900 dark:text-gray-100">Status</label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                                >
                                    <option value="paid">Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                                {errors.status && <div className="text-red-500 dark:text-red-400">{errors.status}</div>}
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