import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";

export default function SeeDetailTransaction() {
    const { props } = usePage();
    const { id_transaksi } = props;
    const [details, setDetails] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const id_transaksi = localStorage.getItem("id_transaksi");
                if (!token) {
                    throw new Error("No token found in localStorage");
                }
                if (!id_transaksi) {
                    throw new Error("No id_transaksi found in localStorage");
                }

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
                console.log("Transaction Details:", response.data.details);
            } catch (error) {
                setError("Failed to fetch transaction details");
                console.error(error);
            }
        };

        fetchTransactionDetails();
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Detail Transaksi
                </h2>
            }
        >
            <Head title="Detail Transaction" />
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
                                <button
                                    onClick={() => {
                                        window.location.href = route('kasir.seetransaksi');
                                    }}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200"
                                >
                                    Go to Transaction
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
                                                Gambar
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details.map((detail, index) => (
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
