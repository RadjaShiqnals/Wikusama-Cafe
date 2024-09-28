import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

export default function KasirDashboard() {
    const user = usePage().props.auth.user;

    const [formData, setFormData] = useState({
        id_meja: '',
        nama_pelanggan: '',
        id_menu: [],
    });

    const [mejaList, setMejaList] = useState([]);
    const [menuList, setMenuList] = useState([]);

    useEffect(() => {
        // Fetch Meja data
        axios.get('/api/kasir/access', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .catch(error => {
            console.error('There was an error fetching the user data!', error);
        });

        // Fetch Meja data
        axios.get('/api/kasir/getmeja', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setMejaList(response.data.meja);
            })
            .catch(error => {
                console.error('There was an error fetching the meja data!', error);
            });

        // Fetch Menu data
        axios.get('/api/kasir/getmenu', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setMenuList(response.data.menu);
            })
            .catch(error => {
                console.error('There was an error fetching the menu data!', error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleMenuChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => {
            const updatedMenu = checked
                ? [...prevFormData.id_menu, value]
                : prevFormData.id_menu.filter((id) => id !== value);
            return {
                ...prevFormData,
                id_menu: updatedMenu,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/kasir/create-transaksi', formData);
            alert(response.data.message);
        } catch (error) {
            alert(error.response.data.message);
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
                            {/* Output token here */}
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="id_meja">Nomor Meja:</label>
                                    <select
                                        id="id_meja"
                                        name="id_meja"
                                        value={formData.id_meja}
                                        onChange={handleChange}
                                        required
                                        className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                                    >
                                        <option value="">Select Meja</option>
                                        {mejaList.map((meja) => (
                                            <option key={meja.id_meja} value={meja.id_meja}>
                                                {meja.nomor_meja}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="nama_pelanggan">Nama Pelanggan:</label>
                                    <input
                                        type="text"
                                        id="nama_pelanggan"
                                        name="nama_pelanggan"
                                        value={formData.nama_pelanggan}
                                        onChange={handleChange}
                                        required
                                        className="bg-white shadow-sm sm:rounded-lg dark:bg-gray-800"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="id_menu">Menu:</label>
                                    <br />
                                    {menuList.map((menu) => (
                                        <div key={menu.id_menu}>
                                            <input
                                                type="checkbox"
                                                id={`menu_${menu.id_menu}`}
                                                name="id_menu"
                                                value={menu.id_menu}
                                                checked={formData.id_menu.includes(menu.id_menu)}
                                                onChange={handleMenuChange}
                                            />
                                            <label htmlFor={`menu_${menu.id_menu}`}>{menu.nama_menu}</label>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit">Create Transaction</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}