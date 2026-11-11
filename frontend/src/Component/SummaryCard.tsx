import labels from "../labels/labels";

export type SummaryCardType = "complete" | "pending";

interface SummaryCardProps {
    type: SummaryCardType;
    count: number;
}

const CompleteIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#253C98" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="m7.5 12.5 3 3 6-7" />
    </svg>
);

const PendingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9303A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="m8 8 8 8M16 8l-8 8" />
    </svg>
);

// Figma: 96px tall card, 15px/16px inset, 28px icon tile, 11px gap to the label.
// Label Regular 12px/28px, count SemiBold 22px, "This Week" Regular 10px #6E7180.
export default function SummaryCard({ type, count }: SummaryCardProps) {
    const complete = type === "complete";
    return (
        // spans (not divs) so the card is valid inside the home page's tappable <button>
        <span className={`block h-[96px] min-w-0 flex-1 px-[15px] pt-4 ${complete ? "bg-primaryLight" : "bg-pendingBg"}`}>
            <span className="flex items-center gap-[11px]">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center ${complete ? "bg-completeTile" : "bg-pendingTile"}`}>
                    {complete ? <CompleteIcon /> : <PendingIcon />}
                </span>
                <span className="whitespace-nowrap text-[12px] font-normal leading-[28px] text-ink">
                    {complete ? labels.taskComplete : labels.taskPending}
                </span>
            </span>
            <span className="mt-[3px] flex items-baseline gap-1 pl-[39px]">
                <span className="text-[22px] font-semibold leading-[33px] text-ink">{String(count).padStart(2, "0")}</span>
                <span className="whitespace-nowrap text-[10px] font-normal leading-[15px] text-weekText">{labels.thisWeek}</span>
            </span>
        </span>
    );
}
