import labels from "../labels/labels";

const SearchIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
    </svg>
);

export default function SearchBar({ value, onChange, onFocus, placeholder, autoFocus, onSubmit }) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.();
            }}
            className="flex h-[47px] w-full items-center gap-2 rounded-md border border-searchBorder bg-white px-4"
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                autoFocus={autoFocus}
                placeholder={placeholder || labels.searchPlaceholder}
                className="h-full flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-[#98A2B3]"
            />
            <button type="submit" aria-label="Search" className="shrink-0">
                <SearchIcon />
            </button>
        </form>
    );
}
