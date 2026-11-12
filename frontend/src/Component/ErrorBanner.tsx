import { useEffect } from "react";
import { X } from "lucide-react";
import { useTasks } from "../hooks/useTasks";

const AUTO_DISMISS_MS = 6000;

export default function ErrorBanner() {
    const { error, clearError } = useTasks();

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(clearError, AUTO_DISMISS_MS);
        return () => clearTimeout(timer);
    }, [error]);

    if (!error) return null;

    return (
        <div role="alert" className="absolute inset-x-4 top-4 z-[60] flex items-start gap-3 bg-danger px-4 py-3 text-white shadow-sheet">
            <p className="min-w-0 flex-1 text-[12px] font-medium leading-[18px]">{error}</p>
            <button onClick={clearError} aria-label="Dismiss error" className="shrink-0">
                <X size={18} strokeWidth={2} />
            </button>
        </div>
    );
}
