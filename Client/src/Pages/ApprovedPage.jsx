import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Landmark,
    Banknote,
    FileCheck2,
    ShieldCheck,
    ArrowRight,
    Lock,
    Loader2,
} from "lucide-react";
import OwnPocketHeader from "../Components/Header";

const NEXT_STEPS = [
    {
        icon: FileCheck2,
        title: "1. Verification",
        desc: "We will verify your details",
    },
    {
        icon: ShieldCheck,
        title: "2. Bank Details",
        desc: "Add your bank account",
    },
    {
        icon: Landmark,
        title: "3. Get Amount",
        desc: "Amount will be sent to your bank account",
    },
];

const CONFETTI = [
    { top: "2px", left: "8px", size: 6, color: "#EC4899", delay: 0.5 },
    { top: "18px", left: "0px", size: 5, color: "#F59E0B", delay: 0.62 },
    { top: "38px", left: "6px", size: 4, color: "#6366F1", delay: 0.74 },
    { top: "4px", left: "70px", size: 5, color: "#22C55E", delay: 0.68 },
    { top: "26px", left: "82px", size: 6, color: "#F59E0B", delay: 0.56 },
    { top: "48px", left: "76px", size: 4, color: "#EC4899", delay: 0.8 },
];

const getPersistedCibilData = () => {
    try {
        return JSON.parse(localStorage.getItem("cibilData") || "null") || {};
    } catch {
        return {};
    }
};

export default function OwnPocketApproved() {
    const navigate = useNavigate(); // ✅ useNavigate hook
    const [isSubmitting, setIsSubmitting] = useState(false);
    const cibilData = useMemo(getPersistedCibilData, []);
    const approvedAmount = Number(cibilData.selectedAmount || 0);
    const approvedTenure = Number(cibilData.tenureMonths || 6);
    const approvedRate = cibilData.estimatedRate || "2.5";

    const handleContinue = async () => {
        try {
            setIsSubmitting(true);
            // Simulate a brief transition before moving to the next step
            await new Promise((resolve) => setTimeout(resolve, 700));
            navigate("/bank-detail"); // ✅ useNavigate se navigate
        } catch (error) {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center py-10 px-4">
            {/* Scoped keyframes for the approval tick animation */}
            <style>{`
                @keyframes opCirclePop {
                    0% { transform: scale(0); opacity: 0; }
                    55% { transform: scale(1.18); opacity: 1; }
                    75% { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }
                @keyframes opCheckDraw {
                    from { stroke-dashoffset: 24; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes opRingPulse {
                    0% { transform: scale(0.6); opacity: 0.55; }
                    100% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes opConfettiPop {
                    0% { transform: scale(0) translateY(4px); opacity: 0; }
                    60% { transform: scale(1.3) translateY(0); opacity: 1; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @keyframes opFadeUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .op-tick-ring {
                    animation: opRingPulse 1.1s ease-out 0.15s 1;
                }
                .op-tick-circle {
                    animation: opCirclePop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
                }
                .op-tick-check {
                    stroke-dasharray: 24;
                    stroke-dashoffset: 24;
                    animation: opCheckDraw 0.35s ease-out 0.55s forwards;
                }
                .op-confetti-dot {
                    opacity: 0;
                    animation: opConfettiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                .op-heading-fade {
                    opacity: 0;
                    animation: opFadeUp 0.5s ease-out 0.35s forwards;
                }
            `}</style>

            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">

                <div className="overflow-y-auto">
                    {/* header */}
                    <OwnPocketHeader />

                    {/* approved banner */}
                    <div className="mx-4 mt-4 bg-[#EEF6EF] rounded-2xl p-4 relative overflow-hidden">
                        <div className="relative w-14 h-14 mb-4">
                            {CONFETTI.map((c, i) => (
                                <span
                                    key={i}
                                    className="absolute rounded-full op-confetti-dot"
                                    style={{
                                        top: c.top,
                                        left: c.left,
                                        width: c.size,
                                        height: c.size,
                                        background: c.color,
                                        animationDelay: `${c.delay}s`,
                                    }}
                                />
                            ))}

                            {/* expanding ring pulse behind the tick */}
                            <span className="op-tick-ring absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#1FA24C]" />

                            <div className="op-tick-circle w-12 h-12 rounded-full bg-[#1FA24C] flex items-center justify-center relative">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                                    <path
                                        className="op-tick-check"
                                        d="M6 12.5L10 16.5L18 8"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                            <div className="max-w-[180px] op-heading-fade">
                                <h1 className="text-[22px] font-extrabold leading-[1.15]">
                                    <span className="text-[#0F1B3D]">Your Loan Has</span>
                                    <br />
                                    <span className="text-[#1FA24C]">Been Approved!</span>
                                </h1>
                                <p className="text-[12.5px] text-[#5B6072] leading-relaxed mt-2.5">
                                    Congratulations! Your loan is approved. Proceed to add your
                                    bank account to receive the amount.
                                </p>
                            </div>

                            <div className="relative w-[130px] h-[125px] shrink-0 -mt-1">
                                <Landmark
                                    size={92}
                                    className="text-[#B9C1D9] absolute right-0 top-0"
                                    strokeWidth={1.25}
                                />
                                <div className="absolute right-[6px] bottom-[6px] flex items-end">
                                    <Banknote
                                        size={30}
                                        className="text-[#1FA24C]"
                                        strokeWidth={1.5}
                                        fill="#D9F0DE"
                                    />
                                </div>
                                <div className="absolute right-[-4px] bottom-[24px] w-7 h-7 rounded-full bg-[#1FA24C] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                                        <path
                                            d="M6 12.5L10 16.5L18 8"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 bg-white rounded-xl border border-[#E3EFE6] grid grid-cols-3 divide-x divide-[#EEF0F5] py-3.5">
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Approved Amount</p>
                                <p className="text-[15px] font-extrabold text-[#1FA24C] mt-1">
                                    {approvedAmount
                                        ? `₹ ${approvedAmount.toLocaleString("en-IN")}`
                                        : "Not provided"}
                                </p>
                            </div>
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Tenure</p>
                                <p className="text-[15px] font-extrabold text-[#0F1B3D] mt-1">
                                    {approvedTenure} Months
                                </p>
                            </div>
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Interest Rate</p>
                                <p className="text-[15px] font-extrabold text-[#0F1B3D] mt-1">
                                    {approvedRate}% p.a.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* what happens next */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <p className="text-[16px] font-extrabold text-[#0F1B3D] mb-4">
                            What Happens Next?
                        </p>

                        <div className="flex items-start">
                            {NEXT_STEPS.map((step, i) => (
                                <React.Fragment key={step.title}>
                                    <div className="flex flex-col items-center text-center w-[92px]">
                                        <div className="w-12 h-12 rounded-full bg-[#EAF6EC] flex items-center justify-center mb-2">
                                            <step.icon size={20} className="text-[#1FA24C]" strokeWidth={2} />
                                        </div>
                                        <p className="text-[11px] font-bold text-[#0F1B3D] leading-tight">
                                            {step.title}
                                        </p>
                                        <p className="text-[10px] text-[#8A8F9E] leading-tight mt-1">
                                            {step.desc}
                                        </p>
                                    </div>
                                    {i < NEXT_STEPS.length - 1 && (
                                        <div className="flex-1 flex items-center justify-center mt-6">
                                            <div className="w-full border-t border-dashed border-[#D6DCEA]" />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* submit button */}
                    <div className="px-4 mt-5">
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={isSubmitting}
                            className={`w-full h-12 rounded-xl font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
                                isSubmitting
                                    ? "bg-[#2A4BDE] text-white opacity-70 cursor-not-allowed"
                                    : "bg-[#2A4BDE] text-white hover:bg-[#1A3BAE] active:scale-[0.99]"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F9E] py-4">
                        <Lock size={11} />
                        Your information is safe and secure with us.
                    </p>
                </div>
            </div>
        </div>
    );
}