import { SquareCheckBig } from "lucide-react";

interface EmptyStateProps {
    title: string;
    subtitle?: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center px-8 py-10 text-center">
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primaryLight">
                <SquareCheckBig size={22} color="#4566EC" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <p className="text-[14px] font-medium leading-[21px] text-ink">{title}</p>
            {subtitle && <p className="mt-1 text-[12px] font-normal leading-[18px] text-fieldLabel">{subtitle}</p>}
        </div>
    );
}
