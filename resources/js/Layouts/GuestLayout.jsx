import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Pages/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (

        <div className="relative flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 dark:bg-gray-900">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-gray-800">
                {children}
            </div>
        </div>

    );
}
