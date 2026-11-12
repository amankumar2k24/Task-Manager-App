import { useMemo, useState } from "react";
import { addDays, isInWeek, startOfWeek } from "../lib/week";

export const useWeek = () => {
    const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date()));
    const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());

    const days = useMemo<Date[]>(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

    const goToWeek = (monday: Date): void => {
        setWeekStart(startOfWeek(monday));
        setSelectedDay(isInWeek(new Date(), startOfWeek(monday)) ? new Date() : startOfWeek(monday));
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
