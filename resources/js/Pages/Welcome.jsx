import { Head, Link } from "@inertiajs/react";
import ThemeToggle from "./ThemeToggle"; // Adjust the path as necessary

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-100 text-black/50 dark:bg-black dark:text-white/50 min-h-screen flex flex-col">
                <header className="flex justify-between items-center p-6 bg-slate-300 text-black dark:bg-black dark:text-white">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="60"
                            height="60"
                            viewBox="0 0 48 48"
                        >
                            <path
                                fill="#80deea"
                                d="M24,34C11.1,34,1,29.6,1,24c0-5.6,10.1-10,23-10c12.9,0,23,4.4,23,10C47,29.6,36.9,34,24,34z M24,16	c-12.6,0-21,4.1-21,8c0,3.9,8.4,8,21,8s21-4.1,21-8C45,20.1,36.6,16,24,16z"
                            ></path>
                            <path
                                fill="#80deea"
                                d="M15.1,44.6c-1,0-1.8-0.2-2.6-0.7C7.6,41.1,8.9,30.2,15.3,19l0,0c3-5.2,6.7-9.6,10.3-12.4c3.9-3,7.4-3.9,9.8-2.5	c2.5,1.4,3.4,4.9,2.8,9.8c-0.6,4.6-2.6,10-5.6,15.2c-3,5.2-6.7,9.6-10.3,12.4C19.7,43.5,17.2,44.6,15.1,44.6z M32.9,5.4	c-1.6,0-3.7,0.9-6,2.7c-3.4,2.7-6.9,6.9-9.8,11.9l0,0c-6.3,10.9-6.9,20.3-3.6,22.2c1.7,1,4.5,0.1,7.6-2.3c3.4-2.7,6.9-6.9,9.8-11.9	c2.9-5,4.8-10.1,5.4-14.4c0.5-4-0.1-6.8-1.8-7.8C34,5.6,33.5,5.4,32.9,5.4z"
                            ></path>
                            <path
                                fill="#80deea"
                                d="M33,44.6c-5,0-12.2-6.1-17.6-15.6C8.9,17.8,7.6,6.9,12.5,4.1l0,0C17.4,1.3,26.2,7.8,32.7,19	c3,5.2,5,10.6,5.6,15.2c0.7,4.9-0.3,8.3-2.8,9.8C34.7,44.4,33.9,44.6,33,44.6z M13.5,5.8c-3.3,1.9-2.7,11.3,3.6,22.2	c6.3,10.9,14.1,16.1,17.4,14.2c1.7-1,2.3-3.8,1.8-7.8c-0.6-4.3-2.5-9.4-5.4-14.4C24.6,9.1,16.8,3.9,13.5,5.8L13.5,5.8z"
                            ></path>
                            <circle
                                cx="24"
                                cy="24"
                                r="4"
                                fill="#80deea"
                            ></circle>
                        </svg>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <ThemeToggle />
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="rounded-md px-3 py-2 text-light dark:text-dark ring-1 ring-transparent transition hover:text-light/70 dark:hover:text-dark/80 focus:outline-none focus-visible:ring-[#FF2D20] dark:focus-visible:ring-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="rounded-md px-3 py-2 text-light dark:text-dark ring-1 ring-transparent transition hover:text-light/70 dark:hover:text-dark/80 focus:outline-none focus-visible:ring-[#FF2D20] dark:focus-visible:ring-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="rounded-md px-3 py-2 text-light dark:text-dark ring-1 ring-transparent transition hover:text-light/70 dark:hover:text-dark/80 focus:outline-none focus-visible:ring-[#FF2D20] dark:focus-visible:ring-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <section className="flex flex-grow items-center justify-center">
                    <div className="w-full max-w-7xl p-6">
                        <h2 className="text-3xl font-semibold mb-4 text-center">
                            Welcome to Wikusama Cafe
                        </h2>
                        <p className="text-lg text-center text-gray-600 dark:text-white">
                            Wikusama Cafe bukan hanya sekadar tempat untuk
                            menikmati makanan dan minuman. Ini adalah pusat
                            pertemuan bagi alumni SMK Telkom Malang dari
                            berbagai angkatan. Di sini, Anda dapat menjalin
                            kembali hubungan dengan teman lama, bertemu dengan
                            kolega baru, dan berbagi pengalaman. Mari
                            bersama-sama membangun jaringan yang kuat dan saling
                            mendukung.
                        </p>
                    </div>
                </section>
                <main className="flex-grow flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl p-6">
                        <div className="bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                            <h2 className="text-xl font-semibold mb-4">
                                Example 1
                            </h2>
                            <p className="text-sm">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed nec nunc auctor, tincidunt
                                nisl id, aliquam nunc. Nullam auctor, nisl id
                                aliquam nunc.
                            </p>
                        </div>
                        <div className="bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                            <h2 className="text-xl font-semibold mb-4">
                                Example 2
                            </h2>
                            <p className="text-sm">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed nec nunc auctor, tincidunt
                                nisl id, aliquam nunc. Nullam auctor, nisl id
                                aliquam nunc.
                            </p>
                        </div>
                        <div className="bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]">
                            <h2 className="text-xl font-semibold mb-4">
                                Example 3
                            </h2>
                            <p className="text-sm">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed nec nunc auctor, tincidunt
                                nisl id, aliquam nunc. Nullam auctor, nisl id
                                aliquam nunc.
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400 p-4 text-center flex justify-between">
                    <div className="flex items-center">
                        <svg
                            className="h-6 w-6 mr-2 text-gray-600 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                        <span className="text-sm">
                            &copy; 2022 Your Company. All rights reserved.
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                            >
                                <path d="M11.666,2.005C6.62,2.17,2.374,6.251,2.025,11.288c-0.369,5.329,3.442,9.832,8.481,10.589V14.65H8.892 c-0.726,0-1.314-0.588-1.314-1.314v0c0-0.726,0.588-1.314,1.314-1.314h1.613v-1.749c0-2.896,1.411-4.167,3.818-4.167 c0.357,0,0.662,0.008,0.921,0.021c0.636,0.031,1.129,0.561,1.129,1.198v0c0,0.663-0.537,1.2-1.2,1.2h-0.442 c-1.022,0-1.379,0.969-1.379,2.061v1.437h1.87c0.591,0,1.043,0.527,0.953,1.111l-0.108,0.701c-0.073,0.47-0.477,0.817-0.953,0.817 h-1.762v7.247C18.235,21.236,22,17.062,22,12C22,6.366,17.341,1.821,11.666,2.005z"></path>
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                            >
                                <path d="M 8 3 C 5.239 3 3 5.239 3 8 L 3 16 C 3 18.761 5.239 21 8 21 L 16 21 C 18.761 21 21 18.761 21 16 L 21 8 C 21 5.239 18.761 3 16 3 L 8 3 z M 18 5 C 18.552 5 19 5.448 19 6 C 19 6.552 18.552 7 18 7 C 17.448 7 17 6.552 17 6 C 17 5.448 17.448 5 18 5 z M 12 7 C 14.761 7 17 9.239 17 12 C 17 14.761 14.761 17 12 17 C 9.239 17 7 14.761 7 12 C 7 9.239 9.239 7 12 7 z M 12 9 A 3 3 0 0 0 9 12 A 3 3 0 0 0 12 15 A 3 3 0 0 0 15 12 A 3 3 0 0 0 12 9 z"></path>
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                            >
                                <path d="M10.053,7.988l5.631,8.024h-1.497L8.566,7.988H10.053z M21,21H3V3h18V21z M17.538,17l-4.186-5.99L16.774,7h-1.311l-2.704,3.16L10.552,7H6.702l3.941,5.633L6.906,17h1.333l3.001-3.516L13.698,17H17.538z"></path>
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                            >
                                <path d="M 10.5 3 C 5.813 3 2 6.14 2 10 C 2 11.363 2.4712344 12.668687 3.3652344 13.804688 L 3.0117188 17.771484 C 2.9747188 18.183484 3.4393906 18.447078 3.7753906 18.205078 L 6.5488281 16.197266 C 7.6878797 16.690511 8.9474402 16.953333 10.236328 16.986328 C 10.955859 19.275512 13.264379 20.957031 16 20.957031 C 16.848 20.957031 17.677703 20.788125 18.470703 20.453125 L 21.277344 21.609375 C 21.635344 21.757375 22.015125 21.455266 21.953125 21.072266 L 21.421875 17.783203 C 21.805875 17.043203 22 16.269516 22 15.478516 C 22 13.437939 20.76981 11.657677 18.953125 10.714844 C 18.982151 10.477946 19 10.240343 19 10 C 19 6.14 15.187 3 10.5 3 z M 8.0175781 6.75 C 8.7085781 6.75 9.2675781 7.3043281 9.2675781 7.9863281 C 9.2675781 8.6683281 8.7085781 9.25 8.0175781 9.25 C 7.3265781 9.25 6.7675781 8.6703281 6.7675781 7.9863281 C 6.7675781 7.3033281 7.3265781 6.75 8.0175781 6.75 z M 13.013672 6.75 C 13.695672 6.75 14.25 7.3043281 14.25 7.9863281 C 14.25 8.6703281 13.696672 9.25 13.013672 9.25 C 12.328672 9.25 11.75 8.6703281 11.75 7.9863281 C 11.75 7.3033281 12.329672 6.75 13.013672 6.75 z M 16 12 C 18.206 12 20 13.560516 20 15.478516 C 20 16.019516 19.839437 16.560031 19.523438 17.082031 L 19.332031 17.396484 L 19.550781 18.734375 L 18.404297 18.263672 L 17.994141 18.470703 C 17.355141 18.794703 16.685 18.957031 16 18.957031 C 13.794 18.957031 12 17.396516 12 15.478516 C 12 13.560516 13.794 12 16 12 z M 14.021484 14 C 13.469484 14 13 14.447 13 15 C 13 15.553 13.472484 16 14.021484 16 C 14.570484 16 15.015625 15.553 15.015625 15 C 15.015625 14.447 14.571484 14 14.021484 14 z M 17.992188 14 A 0.99299997 1 0 0 0 17 15 A 0.99299997 1 0 0 0 17.992188 16 A 0.99299997 1 0 0 0 18.986328 15 A 0.99299997 1 0 0 0 17.992188 14 z"></path>
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                x="0px"
                                y="0px"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M7.738,17L7.738,17 c-0.697,0-1.262-0.565-1.262-1.262v-4.477C6.477,10.565,7.042,10,7.738,10h0C8.435,10,9,10.565,9,11.262v4.477 C9,16.435,8.435,17,7.738,17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2 S8.551,8.717,7.694,8.717z M16.779,17L16.779,17c-0.674,0-1.221-0.547-1.221-1.221v-2.605c0-1.058-0.651-1.174-0.895-1.174 s-1.058,0.035-1.058,1.174v2.605c0,0.674-0.547,1.221-1.221,1.221h-0.081c-0.674,0-1.221-0.547-1.221-1.221v-4.517 c0-0.697,0.565-1.262,1.262-1.262h0c0.697,0,1.262,0.565,1.262,1.262c0,0,0.282-1.262,2.198-1.262C17.023,10,18,10.977,18,13.174 v2.605C18,16.453,17.453,17,16.779,17z"></path>
                            </svg>
                        </a>
                    </div>
                </footer>
            </div>
        </>
    );
}
