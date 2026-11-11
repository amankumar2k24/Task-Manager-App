import labels from "../labels/labels";

const CheckIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

const CrossIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round">
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);

export type SummaryCardType = "complete" | "pending";

interface SummaryCardProps {
    type: SummaryCardType;
    count: number;
}

export default function SummaryCard({ type, count }: SummaryCardProps) {
    const complete = type === "complete";
    return (
        <div className={`flex h-[96px] flex-1 flex-col gap-1 rounded-2xl p-3.5 ${complete ? "bg-primaryLight" : "bg-pendingBg"}`}>
            <div className="flex items-center gap-1.5">
                <span className={`flex h-[22px] w-[22px] items-center justify-center rounded-md ${complete ? "bg-primary" : "bg-danger"}`}>
                    {complete ? <CheckIcon /> : <CrossIcon />}
                </span>
                <span className="text-[12px] font-medium text-ink">{complete ? labels.taskComplete : labels.taskPending}</span>
            </div>
            <div className="flex items-baseline gap-1 pl-[1px]">
                <span className="text-[28px] font-bold leading-none text-ink">{String(count).padStart(2, "0")}</span>
                <span className="text-[11px] text-muted">{labels.thisWeek}</span>
            </div>
        </div>
    );
}
