import { useRef } from "react";
import type { TouchEvent } from "react";
import { formatDayName } from "../utils/format";
import { isSameDay, isToday } from "../lib/week";

interface WeekStripProps {
    days: Date[];
    selectedDay: Date;
    onSelectDay: (day: Date) => void;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

const SWIPE_THRESHOLD = 50;

export default function WeekStrip({ days, selectedDay, onSelectDay, onSwipeLeft, onSwipeRight }: WeekStripProps) {
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
        touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = (e: TouchEvent<HTMLDivElement>): void => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
    };

    return (
        <div
            className="-mx-[6px] flex touch-pan-y items-start justify-between"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {days.map((day) => {
                const selected = isSameDay(day, selectedDay);
                const today = isToday(day);
                return (
                    <button
                        key={day.toISOString()}
                        onClick={() => onSelectDay(day)}
                        aria-pressed={selected}
                        aria-label={day.toDateString()}
                        className={`flex min-w-[35px] flex-col items-center justify-center px-2 text-center ${selected ? "gap-1 bg-primary py-[6px] text-white" : "py-1 text-dayMuted"
                            }`}
                    >
                        <span className="flex flex-col">
                            <span className="text-[10px] font-normal leading-[22px]">{formatDayName(day)}</span>
                            <span className="text-[14px] font-medium leading-[22px]">{String(day.getDate()).padStart(2, "0")}</span>
                        </span>
                        {selected && <span className={`h-1 w-1 rounded-full ${today ? "bg-white" : "bg-white/60"}`} />}
                    </button>
                );
            })}
        </div>
    );
}
