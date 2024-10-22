import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';

export default function AdminDashboard() {
    const { data, setData, post, errors } = useForm({
        nama_menu: '',
        jenis: 'makanan',
        deskripsi: '',
        gambar: null,
        harga: ''
    });

    const [menuList, setMenuList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDescriptionModalOpen, setDescriptionIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {


        // Fetch Menu data
        axios
            .get("/api/admin/getmenu", {
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

    const handleDescriptionClick = (description) => {
        setSelectedDescription(description);
        setDescriptionIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setDescriptionIsModalOpen(false);
        setSelectedDescription('');
    };

    const handleEditClick = (menu) => {
        setSelectedMenu(menu);
        setData({
            id_menu: menu.id_menu,
            nama_menu: menu.nama_menu,
            jenis: menu.jenis,
            deskripsi: menu.deskripsi,
            gambar: null,
            harga: menu.harga
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (id_menu) => {
        try {
            const response = await axios.delete(`/api/admin/delete-menu/${id_menu}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            });
            setMenuList(menuList.filter(menu => menu.id_menu !== id_menu));
            setSuccessMessage(response.data.message);
        } catch (error) {
            console.error("There was an error deleting the menu!", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            id_menu: data.id_menu,
            nama_menu: data.nama_menu,
            jenis: data.jenis,
            deskripsi: data.deskripsi,
            harga: data.harga,
        };
    
        if (data.gambar) {
            const formData = new FormData();
            formData.append('gambar', data.gambar);
            payload.gambar = formData.get('gambar');
        }
    
        try {
            const response = await axios.put('/api/admin/edit-menu', payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });
            setSuccessMessage(response.data.message);
            setMenuList(menuList.map(menu => menu.id_menu === data.id_menu ? response.data.menu : menu));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("There was an error updating the menu!", error);
        }
    };
    const truncateDescription = (description) => {
        const words = description.split(' ');
        return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : description;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nama_menu', data.nama_menu);
        formData.append('jenis', data.jenis);
        formData.append('deskripsi', data.deskripsi);
        formData.append('harga', data.harga);
        if (data.gambar) {
            formData.append('gambar', data.gambar);
        }
    
        try {
            const response = await axios.post('/api/admin/create-menu', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setSuccessMessage(response.data.message);
            setMenuList([...menuList, response.data.menu]);
            setIsModalOpen(false);
        } catch (error) {
            console.error("There was an error creating the menu!", error);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Create Menu</h2>}
        >
            <Head title="Manage Menu" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-dark-form">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <button
                                className="bg-light-primary hover:bg-light-primary_hover text-white font-bold py-2 px-4 rounded mb-4"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Create Menu
                            </button>
                            {successMessage && (
                                <div className="text-green-500 mb-4">{successMessage}</div>
                            )}
                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Menu List</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                    {menuList.map((menu) => (
                                        <div key={menu.id_menu} className="bg-white dark:bg-dark-form p-4 rounded-lg shadow-xl">
                                            <img src={`/storage/${menu.gambar}`} alt={menu.nama_menu} className="w-full h-32 object-cover mb-2 max-h-48" />
                                            <div className="text-center text-gray-800 dark:text-gray-200">{menu.nama_menu}</div>
                                            <div className="text-center text-gray-800 dark:text-gray-200">{menu.jenis}</div>
                                            <div className="text-center text-gray-800 dark:text-gray-200 cursor-pointer" onClick={() => handleDescriptionClick(menu.deskripsi)}>
                                                {truncateDescription(menu.deskripsi)}
                                            </div>
                                            <div className="text-center text-gray-800 dark:text-gray-200">{menu.harga}</div>
                                            <div className="flex justify-center mt-2">
                                                <button
                                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                                                    onClick={() => handleEditClick(menu)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                                    onClick={() => handleDeleteClick(menu.id_menu)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {isDescriptionModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Description</h3>
                        <p className="mt-4 text-gray-900 dark:text-gray-100">{selectedDescription}</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleCloseModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Create Menu</h3>
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label htmlFor="nama_menu" className="text-gray-900 dark:text-gray-100">Nama Menu</label>
                    <input
                        id="nama_menu"
                        type="text"
                        value={data.nama_menu}
                        onChange={(e) => setData('nama_menu', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.nama_menu && <div className="text-red-500 dark:text-red-400">{errors.nama_menu}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="jenis" className="text-gray-900 dark:text-gray-100">Jenis</label>
                    <select
                        id="jenis"
                        value={data.jenis}
                        onChange={(e) => setData('jenis', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    >
                        <option value="makanan">Makanan</option>
                        <option value="minuman">Minuman</option>
                    </select>
                    {errors.jenis && <div className="text-red-500 dark:text-red-400">{errors.jenis}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="deskripsi" className="text-gray-900 dark:text-gray-100">Deskripsi</label>
                    <textarea
                        id="deskripsi"
                        value={data.deskripsi}
                        onChange={(e) => setData('deskripsi', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.deskripsi && <div className="text-red-500 dark:text-red-400">{errors.deskripsi}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="gambar" className="text-gray-900 dark:text-gray-100">Gambar</label>
                    <input
                        id="gambar"
                        type="file"
                        onChange={(e) => setData('gambar', e.target.files[0])}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.gambar && <div className="text-red-500 dark:text-red-400">{errors.gambar}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="harga" className="text-gray-900 dark:text-gray-100">Harga</label>
                    <input
                        id="harga"
                        type="number"
                        value={data.harga}
                        onChange={(e) => setData('harga', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.harga && <div className="text-red-500 dark:text-red-400">{errors.harga}</div>}
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        className="bg-light-secondary hover:bg-light-accent text-white font-bold py-2 px-4 rounded mr-2"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-light-primary hover:bg-light-primary_hover text-white font-bold py-2 px-4 rounded"
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
        <div className="bg-white dark:bg-dark-form p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Edit Menu</h3>
            <form onSubmit={handleEditSubmit}>
                <div className="mt-4">
                    <label htmlFor="nama_menu" className="text-gray-900 dark:text-gray-100">Nama Menu</label>
                    <input
                        id="nama_menu"
                        type="text"
                        value={data.nama_menu}
                        onChange={(e) => setData('nama_menu', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.nama_menu && <div className="text-red-500 dark:text-red-400">{errors.nama_menu}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="jenis" className="text-gray-900 dark:text-gray-100">Jenis</label>
                    <select
                        id="jenis"
                        value={data.jenis}
                        onChange={(e) => setData('jenis', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    >
                        <option value="makanan">Makanan</option>
                        <option value="minuman">Minuman</option>
                    </select>
                    {errors.jenis && <div className="text-red-500 dark:text-red-400">{errors.jenis}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="deskripsi" className="text-gray-900 dark:text-gray-100">Deskripsi</label>
                    <textarea
                        id="deskripsi"
                        value={data.deskripsi}
                        onChange={(e) => setData('deskripsi', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.deskripsi && <div className="text-red-500 dark:text-red-400">{errors.deskripsi}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="gambar" className="text-gray-900 dark:text-gray-100">Gambar</label>
                    <input
                        id="gambar"
                        type="file"
                        onChange={(e) => setData('gambar', e.target.files[0])}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.gambar && <div className="text-red-500 dark:text-red-400">{errors.gambar}</div>}
                </div>
                <div className="mt-4">
                    <label htmlFor="harga" className="text-gray-900 dark:text-gray-100">Harga</label>
                    <input
                        id="harga"
                        type="number"
                        value={data.harga}
                        onChange={(e) => setData('harga', e.target.value)}
                        className="bg-white shadow-sm sm:rounded-lg dark:bg-dark-form dark:text-gray-100 w-full"
                    />
                    {errors.harga && <div className="text-red-500 dark:text-red-400">{errors.harga}</div>}
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