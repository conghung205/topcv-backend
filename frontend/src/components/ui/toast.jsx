import { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 3500 }) {
    useEffect(() => {
        if (!message || !onClose) return;
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [message, onClose, duration]);

    if (!message) return null;

    const styles = {
        success: "bg-emerald-50 border-emerald-200 text-emerald-900",
        error: "bg-rose-50 border-rose-200 text-rose-900",
        info: "bg-sky-50 border-sky-200 text-sky-900",
    };

    const icons = {
        success: <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />,
        error: <AlertCircle className="size-5 text-rose-600 shrink-0" />,
        info: <Info className="size-5 text-sky-600 shrink-0" />,
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${styles[type] || styles.info}`}>
                {icons[type] || icons.info}
                <div className="text-sm font-medium leading-relaxed flex-1">{message}</div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 p-0.5 rounded transition"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
