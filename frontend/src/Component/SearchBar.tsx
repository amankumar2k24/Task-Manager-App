import { Search } from "lucide-react";
import labels from "../labels/labels";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
    onSubmit?: () => void;
}

// Figma: 47px tall, 4px radius, #E6E6E6 border, Poppins Light 12px placeholder at 60% black.
export default function SearchBar({ value, onChange, onFocus, placeholder, autoFocus, onSubmit }: SearchBarProps) {
    return (
        <form
            role="search"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.();
            }}
            className="flex h-[47px] w-full items-center gap-2 rounded-[4px] border border-searchBorder bg-white pl-5 pr-[14px]"
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                autoFocus={autoFocus}
                aria-label={placeholder || labels.searchPlaceholder}
                placeholder={placeholder || labels.searchPlaceholder}
                className="h-full min-w-0 flex-1 bg-transparent text-[12px] font-light leading-[18px] text-black outline-none placeholder:text-black/60"
            />
            <button type="submit" aria-label="Search" className="shrink-0">
                <Search size={24} strokeWidth={1.5} color="#090E23" />
            </button>
        </form>
    );
}
