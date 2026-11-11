import { useMemo, useState } from "react";
import { addDays, startOfWeek } from "../lib/week";

export const useWeek = () => {
    const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
    const [selectedDay, setSelectedDay] = useState(() => new Date());

    const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

    const goToWeek = (monday) => {
        setWeekStart(startOfWeek(monday));
        setSelectedDay(startOfWeek(monday));
    };

    return {
        weekStart,
        days,
        selectedDay,
        selectDay: setSelectedDay,
        prevWeek: () => goToWeek(addDays(weekStart, -7)),
        nextWeek: () => goToWeek(addDays(weekStart, 7)),
        goToCurrentWeek: () => goToWeek(new Date()),
    };
};
