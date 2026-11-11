interface EmptyStateProps {
    title: string;
    subtitle?: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center px-8 py-10 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primaryLight">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4566EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            </span>
            <p className="text-[14px] font-medium leading-[21px] text-ink">{title}</p>
            {subtitle && <p className="mt-1 text-[12px] font-normal leading-[18px] text-fieldLabel">{subtitle}</p>}
        </div>
    );
}
