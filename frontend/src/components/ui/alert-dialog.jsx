import Modal from "./modal";
import { Button } from "./button";
import { AlertTriangle } from "lucide-react";

export default function AlertDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-md"
            bodyClassName="p-0"
        >
            <div className="p-6">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertTriangle className="size-5" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-base font-semibold text-ink">{title}</h2>
                        <p className="text-sm leading-relaxed text-secondary-copy">{description}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="h-10 rounded-lg px-5">
                        Hủy
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        className="h-10 rounded-lg px-5 font-semibold"
                    >
                        Xác nhận xóa
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
