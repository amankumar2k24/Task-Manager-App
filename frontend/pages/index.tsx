import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import AppLayout from "../src/Layout/AppLayout";
import Onboarding from "../src/Component/Onboarding";
import SearchBar from "../src/Component/SearchBar";
import WeekStrip from "../src/Component/WeekStrip";
import SummaryCard from "../src/Component/SummaryCard";
import WeeklyProgress from "../src/Component/WeeklyProgress";
import TaskRow from "../src/Component/TaskRow";
import EmptyState from "../src/Component/EmptyState";
import { useTasks } from "../src/hooks/useTasks";
import { useTaskSheets } from "../src/hooks/useTaskSheets";
import { useWeek } from "../src/hooks/useWeek";
import { countByStatus, isInWeek, isSameDay, weekStartParam } from "../src/lib/week";
import { formatDayHeading } from "../src/utils/format";
import labels from "../src/labels/labels";

const ONBOARDED_KEY = "todo-onboarded";

export default function Home() {
    const router = useRouter();
    const [onboarded, setOnboarded] = useState<boolean | null>(null);
    const { weekStart, days, selectedDay, selectDay, nextWeek, prevWeek } = useWeek();
    const { items, status, loadTasks } = useTasks();
    const { openCreate, rowActions, sheets } = useTaskSheets();

    useEffect(() => {
        setOnboarded(localStorage.getItem(ONBOARDED_KEY) === "1");
    }, []);

    useEffect(() => {
        loadTasks({ weekStart: weekStartParam(weekStart) });
    }, [weekStart]);

    const weekTasks = items.filter((task) => isInWeek(task.dateTime, weekStart));
    const summary = countByStatus(weekTasks);
    const dayTasks = weekTasks.filter((task) => isSameDay(new Date(task.dateTime), selectedDay));

    if (onboarded === null) return <AppLayout><div className="h-full bg-homeBg" /></AppLayout>;

    if (!onboarded) {
        return (
            <AppLayout>
                <Onboarding
                    onGetStarted={() => {
                        localStorage.setItem(ONBOARDED_KEY, "1");
                        setOnboarded(true);
                    }}
                />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="no-scrollbar h-full overflow-y-auto overflow-x-hidden bg-homeBg px-6 max-[375px]:px-4 pt-[37px]">
                <SearchBar value="" onChange={() => { }} onFocus={() => router.push("/search")} />
                <div className="mt-3">
                    <WeekStrip
                        days={days}
                        selectedDay={selectedDay}
                        onSelectDay={selectDay}
                        onSwipeLeft={nextWeek}
                        onSwipeRight={prevWeek}
                    />
                </div>

                <button
                    onClick={() => router.push("/weeks")}
                    aria-label={`This week: ${summary.completed} completed, ${summary.open} pending. Show all tasks for this week`}
                    className="mt-[30px] flex w-full gap-[17px] max-[375px]:gap-3 text-left"
                >
                    <SummaryCard type="complete" count={summary.completed} />
                    <SummaryCard type="pending" count={summary.open} />
                </button>

                <div className="mt-[30px]">
                    <WeeklyProgress open={summary.open} completed={summary.completed} />
                </div>

                <div className="mt-[30px] flex items-end justify-between">
                    <h2 className="text-[18px] font-semibold leading-[27px] text-ink">{formatDayHeading(selectedDay)}</h2>
                    <button onClick={() => router.push("/weeks")} className="text-[14px] font-medium leading-[21px] text-primary">
                        {labels.viewAll}
                    </button>
                </div>

                <div className="mt-[5px]">
                    {dayTasks.length > 0 ? (
                        dayTasks.map((task) => <TaskRow key={task.id} task={task} {...rowActions(task)} />)
                    ) : status === "loading" ? (
                        <EmptyState title={labels.loading} />
                    ) : (
                        <EmptyState title={labels.noTasksToday} subtitle="Tap + to add your first task for this day" />
                    )}
                </div>

                <div className="pointer-events-none sticky bottom-0 z-40 mt-8 flex justify-center pb-7">
                    <button
                        onClick={() => openCreate(selectedDay)}
                        aria-label="Add task"
                        className="pointer-events-auto flex h-[76px] w-[76px] items-center justify-center rounded-full bg-primary active:bg-primaryDark"
                    >
                        <Plus size={33} color="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {sheets}
        </AppLayout>
    );
}
