import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-xl",
    className = "",
    bodyClassName = "p-6",
    closeButtonClassName = "",
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dialog Container */}
            <div
                className={`relative w-full ${maxWidth} z-10 my-auto rounded-xl bg-white shadow-2xl border border-gray-100 transition-all transform animate-in fade-in zoom-in-95 duration-200 ${className}`}
                role="dialog"
                aria-modal="true"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Đóng modal"
                    className={`absolute right-3 top-3 z-20 inline-flex size-8 items-center justify-center rounded-lg border-0 bg-transparent text-gray-500 shadow-none transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${closeButtonClassName}`}
                >
                    <X className="size-4" />
                </button>

                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 pr-14">
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                )}

                {/* Body */}
                <div className={bodyClassName}>{children}</div>
            </div>
        </div>
    );
}
