import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";

export default function SeeTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [details, setDetails] = useState([]);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const user = usePage().props.auth.user;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    "/api/kasir/get-all-transaksi",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                const userTransactions = response.data.transactions.filter(
                    (transaction) => transaction.id_user === user.id_user
                );
                setTransactions(userTransactions);
            } catch (error) {
                setError("Failed to fetch transactions");
                console.error(error);
            }
        };

        fetchTransactions();
    }, []);

    const handleDownloadPdf = async (id_transaksi) => {
        const token = localStorage.getItem("token");
        const url = `/api/kasir/download-pdf/${id_transaksi}`;
    
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/pdf'
                }
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                window.open(downloadUrl, '_blank');
            } else {
                console.error('Failed to download PDF');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePayTransaction = async (id_transaksi) => {
        try {
            const response = await axios.post(
                "/api/kasir/bayar-transaksi",
                { id_transaksi },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setMessage("Transaction paid successfully");
            setTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction.id_transaksi === id_transaksi
                        ? { ...transaction, status: "lunas" }
                        : transaction
                )
            );
        } catch (error) {
            setError("Failed to pay transaction");
            console.error(error);
        }
    };

    const handleSeeDetailTransaction = async (id_transaksi) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `/api/kasir/get-detail-transaksi/${id_transaksi}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            setDetails(response.data.details);
            setSelectedTransactionId(id_transaksi);
            setIsDetailModalOpen(true);
        } catch (error) {
            setError("Failed to fetch transaction details");
            console.error(error);
        }
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setDetails([]);
        setSelectedTransactionId(null);
    };

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Semua Data Transaksi
                </h2>
            }
        >
            <Head title="See Transactions" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {error && (
                                <div className="text-red-500 mb-4">{error}</div>
                            )}
                            {message && (
                                <div className="text-green-500 mb-4">
                                    {message}
                                </div>
                            )}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800">
                                    <thead>
                                        <tr>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                ID Transaksi
                                            </th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                Nomor Meja
                                            </th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                Nama Pelanggan
                                            </th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                Status
                                            </th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                Tanggal
                                            </th>
                                            <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((transaction) => (
                                            <tr
                                                key={transaction.id_transaksi}
                                                className="bg-white dark:bg-gray-800"
                                            >
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                    {transaction.id_transaksi}
                                                </td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                    {
                                                        transaction
                                                            .meja_relations
                                                            .nomor_meja
                                                    }
                                                </td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                    {transaction.nama_pelanggan}
                                                </td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    {transaction.status === 'belum_bayar' ? (
                                                        <span className="text-red-500">Belum Bayar</span>
                                                    ) : (
                                                        <span className="text-green-500">Lunas</span>
                                                    )}
                                                </td>
                                                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                    {transaction.tgl_transaksi}
                                                </td>
                                                <td className="py-2 px-4 border-b text-center">
                                                    {transaction.status !==
                                                        "lunas" && (
                                                        <button
                                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                            onClick={() =>
                                                                handlePayTransaction(
                                                                    transaction.id_transaksi
                                                                )
                                                            }
                                                        >
                                                            Pay
                                                        </button>
                                                    )}
                                                    <button
                                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                                        onClick={() =>
                                                            handleSeeDetailTransaction(
                                                                transaction.id_transaksi
                                                            )
                                                        }
                                                    >
                                                        Detail
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDownloadPdf(
                                                                transaction.id_transaksi
                                                            )
                                                        }
                                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                                                    >
                                                        Download PDF
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
            {isDetailModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Detail Transaksi</h3>
                        <div className="overflow-x-auto">
                            <button
                                onClick={handleCloseDetailModal}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                            >
                                Close
                            </button>
                            <table className="min-w-full bg-white dark:bg-gray-800">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                            Menu
                                        </th>
                                        <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                            Harga
                                        </th>
                                        <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                            Jumlah
                                        </th>
                                        <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                            Total Harga
                                        </th>
                                        <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                            Gambar
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedDetails.map((detail, index) => (
                                        <tr
                                            key={index}
                                            className="bg-white dark:bg-gray-800"
                                        >
                                            <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                {detail.menu}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                {detail.harga}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                {detail.quantity}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                {detail.totalHarga}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-gray-200">
                                                <img
                                                    src={detail.gambar}
                                                    alt={detail.menu}
                                                    className="w-20 h-20 object-cover mb-2 mx-auto"
                                                />
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
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}