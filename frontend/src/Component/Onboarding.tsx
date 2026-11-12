import labels from "../labels/labels";

const zigzagStyle = {
    width: 96,
    height: 80,
    backgroundSize: "32px 20px",
    backgroundImage: [
        "linear-gradient(45deg, transparent 11.48px, #FFFFFF 11.48px, #FFFFFF 13.98px, transparent 13.98px)",
        "linear-gradient(135deg, transparent 22.8px, #FFFFFF 22.8px, #FFFFFF 25.3px, transparent 25.3px)",
    ].join(", "),
};

const ChevronPattern = () => (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-[18px] -top-[46px] h-[88px] w-[88px] rounded-full bg-white/10" />
        <div className="absolute left-[18px] top-[50px] opacity-[0.16]" style={zigzagStyle} />
        <div className="absolute bottom-[82px] right-[18px] opacity-[0.16]" style={zigzagStyle} />
    </div>
);
interface OnboardingProps {
    onGetStarted: () => void;
}

export default function Onboarding({ onGetStarted }: OnboardingProps) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden">
            <div className="relative min-h-[200px] flex-1 overflow-hidden bg-primary sm:h-[552px] sm:flex-none">
                <ChevronPattern />
            </div>
            <div className="flex shrink-0 flex-col bg-white px-6 max-[375px]:px-4 pb-8 pt-6 sm:flex-1">
                <h1 className="text-[24px] font-semibold leading-[36px] text-black">
                    {labels.onboardingTitle}
                </h1>
                <p className="mt-4 max-w-[307px] text-[12px] font-normal leading-[18px] text-fieldLabel">
                    {labels.onboardingSubtitle}
                </p>
                <div className="min-h-8 flex-1" />
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
