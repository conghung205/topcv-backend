import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

export default function MainLayout() {
    return (
        <div className="bg-bg-main min-h-screen flex flex-col justify-between">
            <Header />
            <div className="pt-[72px] flex-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}