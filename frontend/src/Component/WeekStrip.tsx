import { formatDayName } from "../utils/format";
import { isSameDay, isToday } from "../lib/week";

interface WeekStripProps {
    days: Date[];
    selectedDay: Date;
    onSelectDay: (day: Date) => void;
}

export default function WeekStrip({ days, selectedDay, onSelectDay }: WeekStripProps) {
    return (
        <div className="flex w-full items-start justify-between">
            {days.map((day) => {
                const today = isToday(day);
                const selected = isSameDay(day, selectedDay);
                return (
                    <button
                        key={day.toISOString()}
                        onClick={() => onSelectDay(day)}
                        className={`flex h-[63px] w-[39px] flex-col items-center justify-center gap-1 rounded-xl px-1 ${
                            today ? "bg-primary text-white" : selected ? "bg-[#F2F4F7] text-ink" : "text-ink"
                        }`}
                    >
                        <span className={`text-[11px] leading-none ${today ? "text-white/80" : "text-muted"}`}>
                            {formatDayName(day)}
                        </span>
                        <span className="text-[15px] font-semibold leading-none">{day.getDate()}</span>
                        <span className={`h-1 w-1 rounded-full ${today ? "bg-white" : "bg-transparent"}`} />
                    </button>
                );
            })}
        </div>
    );
}
