import { Palette } from "lucide-react";

/**
 * Thanh menu điều hướng dọc bên trái tinh gọn:
 * Chỉ giữ lại "Thiết kế & Font".
 */
export default function TopCVSidebarNav({ activeNav, setActiveNav }) {
    const navItems = [
        { id: "design", label: "Thiết kế & Font", icon: Palette },
    ];

    return (
        <aside className="w-20 md:w-26 bg-white border-r border-gray-200 flex flex-col items-center py-4 shrink-0 select-none z-20 shadow-xs print:hidden min-h-screen">
            <div className="space-y-2 w-full px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                                setActiveNav(isActive ? null : item.id)
                            }
                            className={`w-full py-3 px-1.5 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 transition-all cursor-pointer ${
                                isActive
                                    ? "bg-emerald-50 text-primary font-bold border border-emerald-200 shadow-2xs"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                            }`}
                        >
                            <Icon
                                className={`size-5 ${isActive ? "text-primary" : "text-gray-500"}`}
                            />
                            <span className="text-[11px] leading-tight font-semibold">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
