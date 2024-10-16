import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ManajerDashboard() {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState('');
    const [filterUserId, setFilterUserId] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/manajer/get-all-transaksi', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTransactions(response.data.transactions);
                setFilteredTransactions(response.data.transactions);
            } catch (error) {
                setError('Failed to fetch transactions');
                console.error(error);
            }
        };

        fetchTransactions();
    }, []);

    useEffect(() => {
        let filtered = transactions;

        if (filterDate) {
            filtered = filtered.filter(transaction => transaction.created_at.startsWith(filterDate));
        }

        if (filterUserId) {
            filtered = filtered.filter(transaction => transaction.user_relations.id_user === filterUserId);
        }

        setFilteredTransactions(filtered);
    }, [filterDate, filterUserId, transactions]);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Jakarta',
            timeZoneName: 'short'
        };
        const date = new Date(dateString);
        let formattedDate = new Intl.DateTimeFormat('id-ID', options).format(date);
        formattedDate = formattedDate.replace('pukul ', ''); // Remove the word "pukul"
        return formattedDate;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manajer Dashboard</h2>}
        >
            <Head title="Manajer Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100 relative">
                            {error && <div className="text-red-500 mb-4">{error}</div>}
                            <div className="bg-transparent w-64">
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-200">Filter by Date:</label>
                                    <input
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-200"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 dark:text-gray-200">Filter by User ID:</label>
                                    <input
                                        type="text"
                                        value={filterUserId}
                                        onChange={(e) => setFilterUserId(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-200"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full bg-white dark:bg-gray-800">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">ID Transaksi</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Kasir</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Tanggal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((transaction, index) => (
                                            <tr key={index} className="bg-white dark:bg-gray-800">
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.id_transaksi}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.user_relations.name}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{formatDate(transaction.created_at)}</td>
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