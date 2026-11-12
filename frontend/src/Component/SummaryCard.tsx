import { SquareCheck, SquareX } from "lucide-react";
import labels from "../labels/labels";

export type SummaryCardType = "complete" | "pending";

interface SummaryCardProps {
    type: SummaryCardType;
    count: number;
}

export default function SummaryCard({ type, count }: SummaryCardProps) {
    const complete = type === "complete";
    return (
        <span className={`block h-[96px] min-w-0 flex-1 px-[15px] pt-4 max-[375px]:px-3 ${complete ? "bg-primaryLight" : "bg-pendingBg"}`}>
            <span className="flex items-center gap-[11px]">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center ${complete ? "bg-completeTile" : "bg-pendingTile"}`}>
                    {complete ? (
                        <SquareCheck size={24} color="#253C98" strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                        <SquareX size={24} color="#C9303A" strokeWidth={1.5} aria-hidden="true" />
                    )}
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
