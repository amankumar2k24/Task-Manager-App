import { useAppSelector } from "../Redux/store";

export default function Loader() {
    const busy = useAppSelector((state) => state.tasks.mutations > 0);
    if (!busy) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="overlay-enter absolute inset-0 z-[70] flex items-center justify-center bg-white/60 backdrop-blur-[1px]"
        >
            <span className="sr-only">Please wait</span>
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <rect x="6" y="6" width="36" height="36" rx="4" stroke="#DADAFF" strokeWidth="3" />
                <rect
                    x="6"
                    y="6"
                    width="36"
                    height="36"
                    rx="4"
                    pathLength={100}
                    stroke="#4566EC"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="loader-chase"
                />
                <path
                    d="M15 25l7 7 12-14"
                    pathLength={100}
                    stroke="#253C98"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="loader-check"
                />
            </svg>
        </div>
    );
}
