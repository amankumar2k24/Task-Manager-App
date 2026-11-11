import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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

const PlusIcon = () => (
    <svg width="33" height="33" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export default function Home() {
    const router = useRouter();
    const [onboarded, setOnboarded] = useState<boolean | null>(null);
    const { weekStart, days, selectedDay, selectDay } = useWeek();
    const { items, status, loadTasks } = useTasks();
    const { openCreate, rowActions, sheets } = useTaskSheets();

    useEffect(() => {
        setOnboarded(localStorage.getItem(ONBOARDED_KEY) === "1");
    }, []);

    useEffect(() => {
        loadTasks({ weekStart: weekStartParam(weekStart) });
    }, [weekStart]);

    // Derive the weekly counts from the task list itself so the cards and progress bar
    // update immediately when a task is toggled, added, edited or deleted.
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
            {/* Spacing follows the Figma Home frame: 37px top, 24px sides, 12px/30px section gaps */}
            <div className="no-scrollbar h-full overflow-y-auto overflow-x-hidden bg-homeBg px-6 pb-[128px] pt-[37px]">
                <SearchBar value="" onChange={() => { }} onFocus={() => router.push("/search")} />
                <div className="mt-3">
                    <WeekStrip days={days} selectedDay={selectedDay} onSelectDay={selectDay} />
                </div>

                {/* This week's card: open vs completed counts. Tapping it opens the week list,
                    where the current week's card is expanded to show all of its tasks. */}
                <button
                    onClick={() => router.push("/weeks")}
                    aria-label={`This week: ${summary.completed} completed, ${summary.open} pending. Show all tasks for this week`}
                    className="mt-[30px] flex w-full gap-[17px] text-left"
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
            </div>

            <button
                onClick={() => openCreate(selectedDay)}
                aria-label="Add task"
                className="absolute bottom-7 left-1/2 z-40 flex h-[76px] w-[76px] -translate-x-1/2 items-center justify-center rounded-full bg-primary active:bg-primaryDark"
            >
                <PlusIcon />
            </button>

            {sheets}
        </AppLayout>
    );
}
