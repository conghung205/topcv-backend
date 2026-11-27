import { NavLink } from "react-router-dom";
import { MENU_ITEMS } from "../../../constants/menuItem";

export default function DesktopNavbar() {
    return (
        <nav className="flex items-center">
            {MENU_ITEMS.map((item, index) => (
                <div
                    className="group relative cursor-pointer px-5 py-2 text-sm font-medium"
                    key={index}
                >
                    <NavLink
                        to={item.path === "#" ? "#" : (item.path.startsWith("/") ? item.path : `/${item.path}`)}
                        className="flex items-center gap-1 text-text transition-colors hover:text-primary"
                    >
                        {item.label} {item.icon && <item.icon className="size-5" />}
                    </NavLink>

                    {item.columns && (
                        <div className="invisible absolute top-full left-0 z-10 flex cursor-default gap-10 rounded-lg bg-white p-3 text-sm font-medium opacity-0 shadow-dropdown whitespace-nowrap transition-all duration-200 group-hover:visible group-hover:opacity-100">
                            {item.columns.map((column, i) => (
                                <div key={i} className="flex min-w-[150px] flex-col gap-2">
                                    {column.title && (
                                        <p className="mb-1 px-3.5 text-xs font-semibold text-[#9a9a9a] uppercase">
                                            {column.title}
                                        </p>
                                    )}
                                    {column.items.map((sub, j) => (
                                        <NavLink
                                            key={j}
                                            to={
                                                sub.type === "search"
                                                    ? `/tim-viec-lam-${sub.slug}`
                                                    : (sub.path.startsWith("/") ? sub.path : `/${sub.path}`)
                                            }
                                            onClick={(e) => {
                                                if (sub.label === "Tìm việc làm" || sub.path === "vieclam" || sub.path === "/vieclam") {
                                                    if (window.location.pathname === "/vieclam" || window.location.pathname === "/") {
                                                        e.preventDefault();
                                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                                    }
                                                }
                                            }}

                                            className="group/link flex cursor-pointer items-center gap-1 rounded-lg px-3.5 py-1.5 text-text transition-colors hover:bg-bg-main hover:text-primary"
                                        >
                                            {sub.label}{" "}
                                            {sub.icon && (
                                                <sub.icon className="invisible -translate-x-2.5 opacity-0 transition-all duration-100 group-hover/link:visible group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}