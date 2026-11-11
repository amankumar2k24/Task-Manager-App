import labels from "../labels/labels";

const ChevronPattern = () => (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 552" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.16" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18,52 34,68 50,52 66,68 82,52 98,68 114,52" />
            <polyline points="18,72 34,88 50,72 66,88 82,72 98,88 114,72" />
            <polyline points="18,92 34,108 50,92 66,108 82,92 98,108 114,92" />
            <polyline points="18,112 34,128 50,112 66,128 82,112 98,128 114,112" />
            <polyline points="276,392 292,408 308,392 324,408 340,392 356,408 372,392" />
            <polyline points="276,412 292,428 308,412 324,428 340,412 356,428 372,412" />
            <polyline points="276,432 292,448 308,432 324,448 340,432 356,448 372,432" />
            <polyline points="276,452 292,468 308,452 324,468 340,452 356,468 372,452" />
        </g>
        <circle cx="352" cy="34" r="52" fill="#FFFFFF" opacity="0.07" />
        <circle cx="352" cy="34" r="30" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.14" />
    </svg>
);

export default function Onboarding({ onGetStarted }) {
    return (
        <div className="flex min-h-[100dvh] flex-col">
            <div className="relative h-[552px] shrink-0 bg-primary">
                <ChevronPattern />
            </div>
            <div className="flex flex-1 flex-col bg-white px-6 pb-[33px] pt-8">
                <h1 className="text-[30px] font-bold leading-[1.15] text-ink">{labels.onboardingTitle}</h1>
                <p className="mt-6 max-w-[280px] text-[14px] leading-relaxed text-muted">{labels.onboardingSubtitle}</p>
                <button
                    onClick={onGetStarted}
                    className="mt-auto h-12 w-full bg-primary text-[16px] font-semibold text-white active:bg-primaryDark"
                >
                    {labels.getStarted}
                </button>
            </div>
        </div>
    );
}
