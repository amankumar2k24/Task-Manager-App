import labels from "../labels/labels";

const ChevronPattern = () => (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 390 552" preserveAspectRatio="none" aria-hidden="true">
        <defs>
            <clipPath id="chevron-clip">
                <rect x="0" y="0" width="390" height="552" />
            </clipPath>
        </defs>
        <g clipPath="url(#chevron-clip)">
            {/* Top-right circles - positioned to be partially visible */}
            {/* Figma: 88px circle at x=320, y=-46 (center 364,-2) */}
            <circle cx="364" cy="-2" r="44" fill="#FFFFFF" opacity="0.1" />

            <g stroke="#FFFFFF" strokeWidth="2.5" fill="none" opacity="0.16" strokeLinecap="round" strokeLinejoin="round">
                {/* Top-left chevrons */}
                <polyline points="18,52 34,68 50,52 66,68 82,52 98,68 114,52" />
                <polyline points="18,72 34,88 50,72 66,88 82,72 98,88 114,72" />
                <polyline points="18,92 34,108 50,92 66,108 82,92 98,108 114,92" />
                <polyline points="18,112 34,128 50,112 66,128 82,112 98,128 114,112" />
                {/* Bottom-right chevrons */}
                <polyline points="276,392 292,408 308,392 324,408 340,392 356,408 372,392" />
                <polyline points="276,412 292,428 308,412 324,428 340,412 356,428 372,412" />
                <polyline points="276,432 292,448 308,432 324,448 340,432 356,448 372,432" />
                <polyline points="276,452 292,468 308,452 324,468 340,452 356,468 372,452" />
            </g>
        </g>
    </svg>
);

interface OnboardingProps {
    onGetStarted: () => void;
}

export default function Onboarding({ onGetStarted }: OnboardingProps) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden">
            <div className="relative h-[552px] shrink-0 overflow-hidden bg-primary">
                <ChevronPattern />
            </div>
            {/* Figma: title SemiBold 24px black, 16px gap, body Regular 12px #717171 (307px wide), CTA 48px Medium 16px */}
            <div className="flex flex-1 flex-col bg-white px-6 pb-8 pt-6">
                <h1 className="text-[24px] font-semibold leading-[36px] text-black">
                    {labels.onboardingTitle}
                </h1>
                <p className="mt-4 max-w-[307px] text-[12px] font-normal leading-[18px] text-fieldLabel">
                    {labels.onboardingSubtitle}
                </p>
                <div className="flex-1" />
                <button
                    onClick={onGetStarted}
                    className="h-12 w-full bg-primary text-[16px] font-medium leading-5 text-white active:bg-primaryDark"
                >
                    {labels.getStarted}
                </button>
            </div>
        </div>
    );
}
