import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import ThemeToggle from "@/Pages/ThemeToggle";
import LogoutButton from "@/Components/LogoutButton";
import SendPayment from "@/Pages/Kasir/SendPayment"; // Import SendPayment component

export default function Authenticated({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const getDashboardLink = () => {
        switch (user.role) {
            case "admin":
                return "/admin/dashboard";
            case "kasir":
                return "/kasir/dashboard";
            case "manajer":
                return "/manajer/dashboard";
            default:
                return "/dashboard";
        }
    };
    return (
        <div className="min-h-screen bg-light-background filter brightness-90 dark:bg-dark-background">
            <nav className="border-b border-gray-100 bg-light-background dark:border-gray-700 dark:bg-dark-secondary">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={getDashboardLink()}>
                                    <ApplicationLogo className="block h-[30px] w-[30px] fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                onClick={() => {
                                    localStorage.removeItem('id_transaksi');
                                }}
                                    href={getDashboardLink()}
                                    active={
                                        user.role === "kasir"
                                            ? route().current('kasir.dashboard')
                                            : user.role === "admin"
                                            ? route().current('admin.dashboard')
                                            : user.role === "manajer"
                                            ? route().current('manajer.dashboard')
                                            : false
                                    }
                                >
                                    Dashboard
                                </NavLink>
                                {user.role === "kasir" && (
                                    <NavLink
                                    onClick={() => {
                                        localStorage.removeItem('id_transaksi');
                                    }}
                                    href={route("kasir.seetransaksi")}
                                    active={route().current(
                                        "kasir.seetransaksi"
                                    )}
                                    >
                                        See Transaksi
                                    </NavLink>
                                )}
                                {user.role === "admin" && (
                                    <NavLink
                                        href={route("admin.user")}
                                        active={route().current(
                                            "admin.user"
                                        )}
                                    >
                                        User
                                    </NavLink>
                                )}
                                {user.role === "admin" && (
                                    <NavLink
                                        href={route("admin.meja")}
                                        active={route().current(
                                            "admin.meja"
                                        )}
                                    >
                                        Meja
                                    </NavLink>
                                )}
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <ThemeToggle />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-dark-accent dark:text-gray-300 dark:hover:text-gray-400"
                                            >
                                                {user.username} | {user.role}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <LogoutButton className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-secondary dark:focus:bg-dark-secondary" />
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            onClick={() => {
                                localStorage.removeItem('id_transaksi');
                            }}
                                href={getDashboardLink()}
                                active={
                                    user.role === "kasir"
                                        ? route().current('kasir.dashboard')
                                        : user.role === "admin"
                                        ? route().current('admin.dashboard')
                                        : user.role === "manajer"
                                        ? route().current('manajer.dashboard')
                                        : false
                                }
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        {/* {user.role === "kasir" && (
                            <ResponsiveNavLink
                                href={route("kasir.sendpayment")}
                                active={route().current("kasir.sendpayment")}
                            >
                                Send Payment
                            </ResponsiveNavLink>
                        )} */}
                        {user.role === "kasir" && (
                            <ResponsiveNavLink
                            onClick={() => {
                                localStorage.removeItem('id_transaksi');
                            }}
                                href={route("kasir.seetransaksi")}
                                active={route().current("kasir.seetransaksi")}
                            >
                                See Transaksi
                            </ResponsiveNavLink>
                        )}
                        {user.role === "admin" && (
                            <ResponsiveNavLink
                                href={route("admin.user")}
                                active={route().current("admin.user")}
                            >
                                User
                            </ResponsiveNavLink>
                        )}
                        {user.role === "admin" && (
                            <ResponsiveNavLink
                                href={route("admin.meja")}
                                active={route().current("admin.meja")}
                            >
                                Meja
                            </ResponsiveNavLink>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-dark-form">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            <main>{children}</main>
        </div>
    );
}
