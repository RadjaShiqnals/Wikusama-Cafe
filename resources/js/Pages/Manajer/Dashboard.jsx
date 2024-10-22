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
    const [selectedTransaction, setSelectedTransaction] = useState(null); // State for selected transaction
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
            filtered = filtered.filter(transaction => transaction.user_relations.name.toLowerCase().includes(filterUserId.toLowerCase()));
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

    const handleSeeDetail = async (id_transaksi) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/manajer/get-detail-transaksi/${id_transaksi}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            setSelectedTransaction(response.data.details);
            setIsModalOpen(true);

            // Check if id_transaksi exists in local storage
            if (localStorage.getItem('id_transaksi')) {
                localStorage.removeItem('id_transaksi');
            }
            localStorage.setItem('id_transaksi', id_transaksi);
        } catch (error) {
            console.error('Failed to fetch transaction details', error);
        }
    };

    const TransactionDetailModal = ({ details = [], onClose }) => {
        const groupedDetails = details.reduce((acc, detail) => {
            const existingDetail = acc.find(item => item.menu === detail.menu);
            if (existingDetail) {
                existingDetail.quantity += 1;
                existingDetail.totalHarga += detail.harga;
            } else {
                acc.push({ ...detail, quantity: 1, totalHarga: detail.harga });
            }
            return acc;
        }, []);

        const calculateTotalPrice = () => {
            return groupedDetails.reduce((total, detail) => total + detail.totalHarga, 0);
        };

        const handleDownloadPdf = () => {
            const id_transaksi = localStorage.getItem('id_transaksi');
            const token = localStorage.getItem('token');
            if (id_transaksi && token) {
            const url = `/api/manajer/download-pdf/${id_transaksi}`;
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            axios.get(url, { headers, responseType: 'blob' })
                .then(response => {
                const pdfUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const newTab = window.open(pdfUrl, '_blank');
                if (newTab) {
                    newTab.focus();
                } else {
                    window.location.href = pdfUrl;
                }
                })
                .catch(error => {
                console.error('Failed to download PDF', error);
                });
            } else {
            console.error('Transaction ID or token is undefined');
            }
        };

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg">
                <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg w-3/4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Detail Transaksi</h2>
                        <button onClick={onClose} className="text-gray-800 dark:text-gray-200">Close</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-dark-form">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Menu</th>
                                    <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Harga</th>
                                    <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Jumlah</th>
                                    <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Total Harga</th>
                                    <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Gambar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedDetails.map((detail, index) => (
                                    <tr key={index} className="bg-white dark:bg-dark-form">
                                        <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{detail.menu}</td>
                                        <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{detail.harga}</td>
                                        <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{detail.quantity}</td>
                                        <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{detail.totalHarga}</td>
                                        <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                            <img src={detail.gambar} alt={detail.menu} className="w-20 h-20 object-cover mb-2 mx-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-right mt-4">
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Total Harga: Rp {calculateTotalPrice()}
                            </span>
                        </div>
                        <div className="text-right mt-4">
                            <button
                                onClick={handleDownloadPdf}
                                className="bg-light-primary hover:bg-light-primary_hover text-white font-bold py-2 px-4 rounded transition-all duration-200"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Manajer Dashboard</h2>}
        >
            <Head title="Manajer Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-dark-form">
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
                                <table className="min-w-full bg-white dark:bg-dark-form">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">ID Transaksi</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Kasir</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Nama Pelanggan</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Meja</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Status</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Tanggal</th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTransactions.map((transaction, index) => (
                                            <tr key={index} className="bg-white dark:bg-dark-form">
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.id_transaksi}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.user_relations.name}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.nama_pelanggan}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{transaction.meja_relations.nomor_meja}</td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    {transaction.status === 'belum_bayar' ? (
                                                        <span className="text-red-500">Belum Bayar</span>
                                                    ) : (
                                                        <span className="text-green-500">Lunas</span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">{formatDate(transaction.created_at)}</td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                    <button
                                                        onClick={() => handleSeeDetail(transaction.id_transaksi)}
                                                        className="bg-light-primary hover:bg-light-primary_hover text-white font-bold py-2 px-4 rounded transition-all duration-200"
                                                    >
                                                        See Detail Transaction
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
            {isModalOpen && (
                <TransactionDetailModal
                    details={selectedTransaction}
                    onClose={() => {
                        setIsModalOpen(false);
                        localStorage.removeItem('id_transaksi');
                    }}
                />
            )}
        </AuthenticatedLayout>
    );
}