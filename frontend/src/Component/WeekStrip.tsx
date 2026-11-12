import { formatDayName } from "../utils/format";
import { isSameDay, isToday } from "../lib/week";

interface WeekStripProps {
    days: Date[];
    selectedDay: Date;
    onSelectDay: (day: Date) => void;
}

export default function WeekStrip({ days, selectedDay, onSelectDay }: WeekStripProps) {
    return (
        <div className="-mx-[6px] flex items-start justify-between">
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
