import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/images/logo.png";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MENU_ITEMS } from "@/constants/menuItem";

export default function MobileMenu() {
    const [drawer, setDrawer] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpenMenu = (item) => {
        setSelectedItem(item);
    };

    const handleCloseDrawer = () => {
        setDrawer(false);
        setSelectedItem(null);
    };

    const handleBack = () => {
        setSelectedItem(null);
    };

    return (
        <>
            <button
                onClick={() => setDrawer(true)}
                aria-label="Mở menu"
                className="flex size-8 items-center justify-center rounded-full bg-bg-main"
            >
                <Menu className="text-text" />
            </button>

            <Sheet open={drawer} onOpenChange={setDrawer}>
                <SheetContent
                    side="left"
                    showCloseButton={false}
                    className="w-82 max-w-82 gap-0 p-0"
                >
                    <div className="relative h-full w-full overflow-hidden">
                        {/* header */}
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            {selectedItem ? (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handleBack}
                                        className="flex size-8 items-center justify-center rounded-full hover:bg-bg-main"
                                    >
                                        <ChevronLeft className="mr-[-4px] size-4" />
                                    </button>

                                    <div>{selectedItem?.label}</div>
                                </div>
                            ) : (
                                <img
                                    src={logo}
                                    alt=""
                                    className="w-36"
                                />
                            )}

                            <button
                                onClick={handleCloseDrawer}
                                aria-label="Đóng menu"
                                className="absolute top-3 right-4 flex size-8 items-center justify-center rounded-full bg-bg-main"
                            >
                                <X className="size-3.5" />
                            </button>
                        </div>

                        {/* main panel */}
                        <div
                            className={`h-full w-full transition-transform duration-300 ${
                                selectedItem
                                    ? "-translate-x-full"
                                    : "translate-x-0"
                            }`}
                        >
                            <div>
                                {MENU_ITEMS.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-2.5 border-b border-border px-4 py-3"
                                    >
                                        <NavLink
                                            to={item.path}
                                            className="block flex-1 text-sm font-medium text-text hover:text-primary"
                                        >
                                            {item.label}
                                        </NavLink>

                                        {item.columns && (
                                            <button
                                                onClick={() =>
                                                    handleOpenMenu(item)
                                                }
                                                aria-label={`Mở ${item.label}`}
                                                className="flex size-8 items-center justify-center rounded-full bg-bg-main"
                                            >
                                                <ChevronRight className="size-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="px-4 py-[22px]">
                                <Button
                                    variant="outline"
                                    className="w-full text-xs"
                                >
                                    Đăng tuyển & tìm hồ sơ
                                </Button>
                            </div>
                        </div>

                        {/* sub panel */}
                        <div
                            className={`absolute top-[77px] left-0 h-full w-full transition-transform duration-300 ${
                                selectedItem
                                    ? "translate-x-0"
                                    : "translate-x-full"
                            }`}
                        >
                            <div>
                                {selectedItem?.columns?.map((column, index) => (
                                    <div key={index} className="mb-5">
                                        {column.title && (
                                            <p className="mb-1 px-3 text-xs font-semibold text-[#9a9a9a] uppercase">
                                                {column.title}
                                            </p>
                                        )}

                                        {column.items.map((sub, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-2.5 border-b border-border px-4 py-3"
                                            >
                                                <NavLink
                                                    to={
                                                        sub.type === "search"
                                                            ? `/tim-viec-lam-${sub.slug}`
                                                            : sub.path
                                                    }
                                                    onClick={handleCloseDrawer}
                                                    className="block flex-1 text-sm font-medium text-text hover:text-primary"
                                                >
                                                    {sub.label}
                                                </NavLink>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
