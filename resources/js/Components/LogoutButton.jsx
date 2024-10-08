import { useForm } from '@inertiajs/react';
import axios from 'axios';

const logout = async () => {
    try {
        await axios.post(route('logout'));
        localStorage.removeItem('token');
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

// Example usage in a component
const LogoutButton = ({ className }) => (
    <button onClick={logout} className={className}>Logout</button>
);

export default LogoutButton;