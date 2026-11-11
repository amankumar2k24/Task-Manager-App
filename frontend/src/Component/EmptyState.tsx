interface EmptyStateProps {
    title: string;
    subtitle?: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center px-8 py-14 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primaryLight">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4566EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            </span>
            <p className="text-[15px] font-semibold text-ink">{title}</p>
            {subtitle && <p className="mt-1 text-[13px] text-muted">{subtitle}</p>}
        </div>
    );
}
