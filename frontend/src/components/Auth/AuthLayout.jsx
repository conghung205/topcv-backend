import { Link, Outlet } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function AuthLayout() {
    return (
        <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg items-center justify-center">
                <section className="w-full rounded-xl border border-gray-200/80 bg-white p-6 shadow-md sm:p-10">
                    <Link to="/" className="mb-8 flex justify-center" aria-label="Về trang chủ TopCV">
                        <img src={logo} alt="TopCV" className="h-10 w-auto" />
                    </Link>
                    <Outlet />
                </section>
            </div>
        </main>
    );
}
