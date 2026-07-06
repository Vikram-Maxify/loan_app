import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    ArrowLeft,
    ShieldCheck,
    RotateCw,
    Check,
    Loader2,
    FileSearch,
    Landmark,
    BadgeCheck,
    ArrowRight,
    IndianRupee,
    Percent,
    CalendarClock,
    Lock,
    Calculator,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCibilDraft } from "../redux/slice/applicationSlice";
import { validateAmount } from "../utils/validation";
import OwnPocketHeader from "../Components/Header";

const STEPS = [
    { id: "1", label: "Personal Details" },
    { id: "2", label: "Additional Details" },
    { id: "3", label: "Review & Submit" },
];

const CHECK_STAGES = [
    { icon: FileSearch, text: "Verifying your PAN details" },
    { icon: Landmark, text: "Connecting to credit bureau" },
    { icon: BadgeCheck, text: "Fetching your CIBIL score" },
];

const TENURE_OPTIONS = [3, 6, 12];

function scoreMeta(score) {
    if (score >= 750)
        return { label: "Excellent", color: "#1F6F5C", bg: "#EEF3F0" };
    if (score >= 700)
        return { label: "Good", color: "#2A4BDE", bg: "#EAF0FD" };
    if (score >= 650)
        return { label: "Fair", color: "#B8790A", bg: "#FCF1DE" };
    return { label: "Needs improvement", color: "#B8790A", bg: "#FCF1DE" };
}

function formatINR(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
}

// Standard reducing-balance EMI formula
function calcEmi(principal, annualRatePercent, months) {
    const r = annualRatePercent / 12 / 100;
    if (r === 0) return principal / months;
    const factor = Math.pow(1 + r, months);
    return (principal * r * factor) / (factor - 1);
}

export default function OwnPocketCibilCheck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [phase, setPhase] = useState("checking"); // checking | result
    const [stageIndex, setStageIndex] = useState(0);
    const targetScore = useRef(600 + Math.floor(Math.random() * 101)); // 600-700
    const [displayScore, setDisplayScore] = useState(300);
    const [isNavigating, setIsNavigating] = useState(false);

    // max eligible loan amount — random between ₹5,000 and ₹6,000
    const maxLoanAmount = useRef(60000 + Math.floor(Math.random() * 1001));
    const minLoanAmount = 5000;

    const [loanAmount, setLoanAmount] = useState(null);
    const [tenure, setTenure] = useState(6);

    // cycle through checking stages, then reveal result
    useEffect(() => {
        if (phase !== "checking") return;
        if (stageIndex < CHECK_STAGES.length - 1) {
            const t = setTimeout(() => setStageIndex((i) => i + 1), 750);
            return () => clearTimeout(t);
        }
        const finish = setTimeout(() => setPhase("result"), 900);
        return () => clearTimeout(finish);
    }, [phase, stageIndex]);

    // animate score count-up once result is shown
    useEffect(() => {
        if (phase !== "result") return;
        const target = targetScore.current;
        const start = 300;
        const duration = 900;
        const startTime = performance.now();

        let frame;
        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayScore(Math.round(start + (target - start) * eased));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        // default the slider to the midpoint of the eligible range
        setLoanAmount(
            Math.round((minLoanAmount + maxLoanAmount.current) / 2 / 100) * 100
        );

        return () => cancelAnimationFrame(frame);
    }, [phase]);

    const meta = scoreMeta(targetScore.current);
    const angle = -90 + ((displayScore - 300) / (900 - 300)) * 180;

    const estimatedRate = (targetScore.current >= 650 ? 13.5 : 16.5).toFixed(1);

    const emi = useMemo(() => {
        if (!loanAmount) return 0;
        return calcEmi(loanAmount, parseFloat(estimatedRate), tenure);
    }, [loanAmount, tenure, estimatedRate]);

    const totalPayable = emi * tenure;
    const totalInterest = totalPayable - (loanAmount || 0);

    const sliderPercent = loanAmount
        ? ((loanAmount - minLoanAmount) / (maxLoanAmount.current - minLoanAmount)) * 100
        : 0;

    const handleContinue = () => {
        const amountError = validateAmount(loanAmount, {
            min: minLoanAmount,
            max: maxLoanAmount.current,
            label: "Loan amount",
        });
        if (amountError) return;

        setIsNavigating(true);

        // Store CIBIL + EMI data in localStorage for the next step
        const cibilData = {
            score: targetScore.current,
            displayScore: displayScore,
            rating: scoreMeta(targetScore.current).label,
            maxLoanAmount: maxLoanAmount.current,
            selectedAmount: loanAmount,
            tenureMonths: tenure,
            estimatedRate: estimatedRate,
            estimatedEmi: Math.round(emi),
            totalPayable: Math.round(totalPayable),
            totalInterest: Math.round(totalInterest),
            checkedAt: new Date().toISOString(),
        };
        dispatch(setCibilDraft(cibilData));
        localStorage.setItem("cibilData", JSON.stringify(cibilData));

        // Facebook Meta Pixel
        if (window.fbq) {
            window.fbq("track", "ViewContent", {
                content_name: "CIBIL Result",
            });
        }

        setTimeout(() => {
            navigate("/Loanreview");
        }, 500);
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        if (window.fbq) {
            window.fbq("track", "PageView");
            window.fbq("track", "ViewContent", {
                content_name: "CIBIL Check",
            });
        }
    }, []);

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center">
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">

                <div className="  overflow-y-auto">
                    {/* header */}
                    <OwnPocketHeader />

                    {/* step tracker */}
                    <div className="px-6 py-5 border-b border-[#EEF0F5]">
                        <div className="flex items-center">
                            {STEPS.map((step, i) => {
                                const done = i === 0;
                                const active = i === 1;
                                return (
                                    <React.Fragment key={step.id}>
                                        <div className="flex flex-col items-center gap-1.5 w-[76px]">
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${done
                                                    ? "bg-[#2A4BDE] text-white"
                                                    : active
                                                        ? "bg-[#2A4BDE] text-white"
                                                        : "border border-[#D6DCEA] text-[#8A8F9E]"
                                                    }`}
                                            >
                                                {done ? <Check size={13} /> : step.id}
                                            </div>
                                            <span
                                                className={`text-[9.5px] text-center leading-tight font-semibold ${active ? "text-[#2A4BDE]" : "text-[#8A8F9E] font-medium"
                                                    }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {i < STEPS.length - 1 && (
                                            <div className="flex-1 h-px border-t border-dashed border-[#D6DCEA] -mt-5" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* checking phase */}
                    {phase === "checking" && (
                        <div className="px-6 py-14 flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-[#EAF0FD] flex items-center justify-center mb-6">
                                <Loader2 size={30} className="text-[#2A4BDE] animate-spin" />
                            </div>
                            <p className="text-[17px] font-bold text-[#0F1B3D] mb-2">
                                Checking your CIBIL score
                            </p>
                            <p className="text-[12.5px] text-[#5B6072] leading-relaxed mb-8">
                                This usually takes just a few seconds. Please don't close
                                this screen.
                            </p>

                            <div className="w-full flex flex-col gap-3">
                                {CHECK_STAGES.map((stage, i) => {
                                    const state =
                                        i < stageIndex
                                            ? "done"
                                            : i === stageIndex
                                                ? "active"
                                                : "pending";
                                    return (
                                        <div
                                            key={stage.text}
                                            className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors ${state === "pending"
                                                ? "border-[#EEF0F5] opacity-50"
                                                : "border-[#E7E9F0]"
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${state === "done"
                                                    ? "bg-[#1F6F5C]"
                                                    : state === "active"
                                                        ? "bg-[#2A4BDE]"
                                                        : "bg-[#EEF0F5]"
                                                    }`}
                                            >
                                                {state === "done" && (
                                                    <Check size={14} className="text-white" />
                                                )}
                                                {state === "active" && (
                                                    <Loader2
                                                        size={14}
                                                        className="text-white animate-spin"
                                                    />
                                                )}
                                                {state === "pending" && (
                                                    <stage.icon size={14} className="text-[#8A8F9E]" />
                                                )}
                                            </div>
                                            <span
                                                className={`text-[12.5px] text-left ${state === "pending"
                                                    ? "text-[#8A8F9E]"
                                                    : "text-[#0F1B3D] font-medium"
                                                    }`}
                                            >
                                                {stage.text}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* result phase */}
                    {phase === "result" && loanAmount !== null && (
                        <div className="px-5 pt-6 pb-4">
                            <div className="bg-white border border-[#EEF0F5] rounded-2xl p-5 flex flex-col items-center">
                                <p className="text-[12.5px] font-semibold text-[#5B6072] mb-1">
                                    Your CIBIL Score
                                </p>

                                <div className="relative w-[190px] h-[105px] mt-1">
                                    <svg viewBox="0 0 200 110" className="w-full h-full">
                                        <path
                                            d="M 15 100 A 85 85 0 0 1 63 21"
                                            fill="none"
                                            stroke="#E24B4A"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 66 19 A 85 85 0 0 1 100 15"
                                            fill="none"
                                            stroke="#EF9F27"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 103 15 A 85 85 0 0 1 148 32"
                                            fill="none"
                                            stroke="#2A4BDE"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M 151 34 A 85 85 0 0 1 185 100"
                                            fill="none"
                                            stroke="#1F6F5C"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div
                                        className="absolute left-1/2 bottom-[5px] w-[3px] h-[70px] bg-[#0F1B3D] rounded-full origin-bottom"
                                        style={{
                                            transform: `translateX(-50%) rotate(${angle}deg)`,
                                            transition: "transform 60ms linear",
                                        }}
                                    />
                                    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#0F1B3D]" />
                                </div>

                                <p className="text-[38px] font-extrabold text-[#0F1B3D] leading-none -mt-1">
                                    {displayScore}
                                </p>
                                <div
                                    className="mt-2 px-3 py-1 rounded-full text-[11.5px] font-semibold"
                                    style={{ color: meta.color, background: meta.bg }}
                                >
                                    {meta.label}
                                </div>
                                <p className="text-[10.5px] text-[#8A8F9E] mt-3">
                                    Score range 300 &ndash; 900 &middot; Powered by TransUnion CIBIL
                                </p>
                            </div>

                            <div className="mt-4 bg-[#EEF3F0] rounded-2xl p-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#DCEBE3] flex items-center justify-center shrink-0">
                                    <ShieldCheck size={17} className="text-[#1F6F5C]" />
                                </div>
                                <p className="text-[12px] text-[#0F1B3D] leading-snug">
                                    <span className="font-semibold">Great news!</span> You're
                                    pre-qualified for a business loan based on your score.
                                </p>
                            </div>

                            <div className="mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                                <p className="text-[13.5px] font-bold text-[#0F1B3D] mb-3">
                                    Your estimated eligibility
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#EAF0FD] rounded-xl p-3">
                                        <IndianRupee size={15} className="text-[#2A4BDE] mb-1.5" />
                                        <p className="text-[15px] font-extrabold text-[#0F1B3D] leading-none">
                                            {formatINR(maxLoanAmount.current)}
                                        </p>
                                        <p className="text-[10.5px] text-[#5B6072] mt-1">
                                            Max loan amount
                                        </p>
                                    </div>
                                    <div className="bg-[#EAF0FD] rounded-xl p-3">
                                        <Percent size={15} className="text-[#2A4BDE] mb-1.5" />
                                        <p className="text-[15px] font-extrabold text-[#0F1B3D] leading-none">
                                            {estimatedRate}%
                                        </p>
                                        <p className="text-[10.5px] text-[#5B6072] mt-1">
                                            Starting interest rate
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-3 text-[11px] text-[#5B6072]">
                                    <CalendarClock size={13} className="text-[#8A8F9E]" />
                                    Tenure options from 3 to 12 months
                                </div>
                            </div>

                            {/* EMI Calculator */}
                            <div className="mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-7 h-7 rounded-full bg-[#EAF0FD] flex items-center justify-center shrink-0">
                                        <Calculator size={14} className="text-[#2A4BDE]" />
                                    </div>
                                    <p className="text-[13.5px] font-bold text-[#0F1B3D]">
                                        EMI Calculator
                                    </p>
                                </div>

                                {/* Loan amount slider */}
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11.5px] font-medium text-[#5B6072]">
                                        Loan Amount
                                    </span>
                                    <span className="text-[16px] font-extrabold text-[#0F1B3D]">
                                        {formatINR(loanAmount)}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min={minLoanAmount}
                                    max={maxLoanAmount.current}
                                    step={100}
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#2A4BDE]"
                                    style={{
                                        background: `linear-gradient(to right, #2A4BDE 0%, #2A4BDE ${sliderPercent}%, #EEF0F5 ${sliderPercent}%, #EEF0F5 100%)`,
                                    }}
                                />
                                <div className="flex items-center justify-between mt-1.5 mb-5">
                                    <span className="text-[10.5px] text-[#8A8F9E]">
                                        {formatINR(minLoanAmount)}
                                    </span>
                                    <span className="text-[10.5px] text-[#8A8F9E]">
                                        {formatINR(maxLoanAmount.current)}
                                    </span>
                                </div>

                                {/* Tenure selector */}
                                <p className="text-[11.5px] font-medium text-[#5B6072] mb-2">
                                    Select Tenure
                                </p>
                                <div className="grid grid-cols-3 gap-2 mb-5">
                                    {TENURE_OPTIONS.map((months) => (
                                        <button
                                            key={months}
                                            type="button"
                                            onClick={() => setTenure(months)}
                                            className={`h-10 rounded-xl text-[13px] font-semibold border transition-colors ${tenure === months
                                                ? "bg-[#2A4BDE] border-[#2A4BDE] text-white"
                                                : "bg-white border-[#E3E5EC] text-[#5B6072]"
                                                }`}
                                        >
                                            {months} {months === 1 ? "Month" : "Months"}
                                        </button>
                                    ))}
                                </div>

                                {/* EMI result */}
                                <div className="bg-[#EAF0FD] rounded-xl p-4 flex flex-col items-center">
                                    <p className="text-[11px] font-medium text-[#5B6072] mb-1">
                                        Estimated Monthly EMI
                                    </p>
                                    <p className="text-[26px] font-extrabold text-[#2A4BDE] leading-none">
                                        {formatINR(emi)}
                                        <span className="text-[13px] font-semibold text-[#5B6072]">
                                            {" "}/mo
                                        </span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div className="rounded-xl border border-[#EEF0F5] p-3">
                                        <p className="text-[13px] font-extrabold text-[#0F1B3D] leading-none">
                                            {formatINR(totalInterest)}
                                        </p>
                                        <p className="text-[10.5px] text-[#5B6072] mt-1">
                                            Total interest
                                        </p>
                                    </div>
                                    <div className="rounded-xl border border-[#EEF0F5] p-3">
                                        <p className="text-[13px] font-extrabold text-[#0F1B3D] leading-none">
                                            {formatINR(totalPayable)}
                                        </p>
                                        <p className="text-[10.5px] text-[#5B6072] mt-1">
                                            Total payable
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleContinue}
                                disabled={isNavigating}
                                className={`w-full h-12 mt-5 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${isNavigating
                                    ? "opacity-70 cursor-not-allowed"
                                    : "hover:bg-[#1A3BAE] active:scale-[0.99]"
                                    }`}
                            >
                                {isNavigating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Redirecting...
                                    </>
                                ) : (
                                    <>
                                        Continue to Additional Details
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <p className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#8A8F9E] mt-4 pb-2 text-center leading-snug">
                                <Lock size={10} className="shrink-0" />
                                This is a soft check and will not affect your CIBIL score.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}