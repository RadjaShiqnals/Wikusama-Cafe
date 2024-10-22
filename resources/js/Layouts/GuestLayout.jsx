import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Pages/ThemeToggle';
import { Link } from '@inertiajs/react';
import backgroundCover from '../../images/background_cover.jpg';
export default function Guest({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <div className="absolute inset-0 -z-10">
                <img 
                    src={backgroundCover} 
                    alt="Background" 
                    className="w-full h-full object-cover filter blur-lg"
                />
            </div>
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-[#d2c1b0] px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg dark:bg-[#37251b]">
                {children}
            </div>
        </div>
    );
}
