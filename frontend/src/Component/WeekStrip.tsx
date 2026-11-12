import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { formatDayName } from "../utils/format";
import { isSameDay, isToday } from "../lib/week";

interface WeekStripProps {
    days: Date[];
    selectedDay: Date;
    onSelectDay: (day: Date) => void;
    onSwipeLeft: () => void; // next week
    onSwipeRight: () => void; // previous week
}

const SWIPE_THRESHOLD = 50; // px of horizontal travel needed to change week
const DRAG_SLOP = 8; // px before a press counts as a drag (keeps taps working)
const MAX_DRAG = 120; // how far the strip follows the pointer

type SlideDirection = "next" | "prev" | null;

// Swipe (touch) or drag (mouse/pen) left for next week, right for previous week.
// Arrow keys do the same when a day is focused. Uses pointer events so it works with
// both touch and mouse; touch-pan-y leaves vertical page scrolling to the browser.
export default function WeekStrip({ days, selectedDay, onSelectDay, onSwipeLeft, onSwipeRight }: WeekStripProps) {
    const [dragX, setDragX] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [slide, setSlide] = useState<SlideDirection>(null);
    const start = useRef<{ x: number; y: number } | null>(null);
    const didDrag = useRef(false);

    const goNext = (): void => {
        setSlide("next");
        onSwipeLeft();
    };

    const goPrev = (): void => {
        setSlide("prev");
        onSwipeRight();
    };

    const reset = (): void => {
        start.current = null;
        setDragging(false);
        setDragX(0);
    };

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>): void => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        start.current = { x: e.clientX, y: e.clientY };
        didDrag.current = false;
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>): void => {
        if (!start.current) return;
        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;
        if (!didDrag.current) {
            if (Math.abs(dx) < DRAG_SLOP) return;
            // Mostly vertical: let the page scroll instead of dragging the strip.
            if (Math.abs(dy) > Math.abs(dx)) return reset();
            didDrag.current = true;
            setDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
        }
        setDragX(Math.max(-MAX_DRAG, Math.min(MAX_DRAG, dx)));
    };

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>): void => {
        if (!start.current) return;
        const dx = e.clientX - start.current.x;
        const wasDrag = didDrag.current;
        reset();
        if (!wasDrag) return;
        if (dx <= -SWIPE_THRESHOLD) goNext();
        else if (dx >= SWIPE_THRESHOLD) goPrev();
    };

    // A drag that ends on a day must not also select it.
    const handleClickCapture = (e: MouseEvent<HTMLDivElement>): void => {
        if (!didDrag.current) return;
        didDrag.current = false;
        e.preventDefault();
        e.stopPropagation();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
        }
    };

    const slideClass = slide === "next" ? "week-slide-next" : slide === "prev" ? "week-slide-prev" : "";

    return (
        <div
            role="group"
            aria-label={`Week of ${days[0]?.toDateString()}. Swipe, or use the left and right arrow keys, to change week.`}
            className="-mx-[6px] cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={reset}
            onClickCapture={handleClickCapture}
            onKeyDown={handleKeyDown}
        >
            {/* Keyed by week so the slide-in animation replays on every week change */}
            <div
                key={days[0]?.toISOString()}
                className={`flex items-start justify-between ${dragging ? "" : slideClass}`}
                style={{
                    transform: dragX ? `translateX(${dragX}px)` : undefined,
                    transition: dragging ? "none" : "transform 0.2s ease",
                }}
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
                            draggable={false}
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
        </div>
    );
}
