import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export default function KasirDashboard() {
    const user = usePage().props.auth.user;

    const [formData, setFormData] = useState({
        id_meja: "",
        nama_pelanggan: "",
        id_menu: [],
    });

    const [mejaList, setMejaList] = useState([]);
    const [menuList, setMenuList] = useState([]);

    useEffect(() => {
        // Fetch Meja data
        axios
            .get("/api/kasir/access", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the user data!",
                    error
                );
            });

        // Fetch Meja data
        axios
            .get("/api/kasir/getmeja", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                const usedMejaList = response.data.meja.filter(
                    (meja) => meja.status === "available"
                );
                setMejaList(usedMejaList);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the meja data!",
                    error
                );
            });

        // Fetch Menu data
        axios
            .get("/api/kasir/getmenu", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => {
                setMenuList(response.data.menu);
            })
            .catch((error) => {
                console.error(
                    "There was an error fetching the menu data!",
                    error
                );
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleMenuChange = (e, menuId) => {
        const { value } = e.target;
        const quantity = parseInt(value, 10);

        setFormData((prevFormData) => {
            const updatedMenu = prevFormData.id_menu.filter((id) => id !== menuId);
            for (let i = 0; i < quantity; i++) {
                updatedMenu.push(menuId);
            }
            return {
                ...prevFormData,
                id_menu: updatedMenu,
            };
        });
    };

    const calculateTotalPrice = () => {
        return formData.id_menu.reduce((total, menuId) => {
            const menu = menuList.find((menu) => menu.id_menu === menuId);
            return total + menu.harga;
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "/api/kasir/create-transaksi",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            alert(response.data.message);
            window.location.href = "/kasir/see-transaksi";
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Buat Transaksi
                </h2>
            }
        >
            <Head title="Kasir Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <label htmlFor="id_meja">
                                                    Nomor Meja:
                                                </label>
                                            </td>
                                            <td>
                                                <select
                                                    id="id_meja"
                                                    name="id_meja"
                                                    value={formData.id_meja}
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                                                >
                                                    <option value="">
                                                        Select Meja
                                                    </option>
                                                    {mejaList.map((meja) => (
                                                        <option
                                                            key={meja.id_meja}
                                                            value={meja.id_meja}
                                                        >
                                                            {meja.nomor_meja}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label htmlFor="nama_pelanggan">
                                                    Nama Pelanggan:
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    id="nama_pelanggan"
                                                    name="nama_pelanggan"
                                                    value={
                                                        formData.nama_pelanggan
                                                    }
                                                    onChange={handleChange}
                                                    required
                                                    className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label htmlFor="id_menu">
                                                    Menu:
                                                </label>
                                            </td>
                                            <td>
                                                <div className="flex flex-wrap">
                                                    {menuList.map((menu) => (
                                                        <div key={menu.id_menu} className="w-1/3 p-2">
                                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                                                <img src={`/storage/${menu.gambar}`} alt={menu.nama_menu} className="w-full h-32 object-cover mb-2 max-h-48" />
                                                                <div className="text-center text-gray-800 dark:text-gray-200">{menu.nama_menu}</div>
                                                                <div className="text-center text-gray-800 dark:text-gray-200">{menu.harga}</div>
                                                                <div className="text-center">
                                                                    <label htmlFor={`quantity_${menu.id_menu}`} className="block text-gray-700 dark:text-gray-200">Jumlah:</label>
                                                                    <input
                                                                        type="number"
                                                                        id={`quantity_${menu.id_menu}`}
                                                                        name={`quantity_${menu.id_menu}`}
                                                                        min="0"
                                                                        value={formData.id_menu.filter((id) => id === menu.id_menu).length}
                                                                        onChange={(e) => handleMenuChange(e, menu.id_menu)}
                                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-200"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        type="submit"
                                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                                    >
                                        Create Transaction
                                    </button>
                                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Total Harga: Rp {calculateTotalPrice()}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}