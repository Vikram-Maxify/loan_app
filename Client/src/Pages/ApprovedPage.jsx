import React from "react";
import {
    ArrowLeft,
    Menu,
    Landmark,
    Banknote,
    Fingerprint,
    CreditCard,
    Upload,
    ShieldCheck,
    FileCheck2,
    ArrowRight,
    Lock,
    RotateCw,
} from "lucide-react";

const NEXT_STEPS = [
    {
        icon: FileCheck2,
        title: "1. Submit KYC",
        desc: "Upload your KYC documents",
    },
    {
        icon: ShieldCheck,
        title: "2. Verification",
        desc: "We will verify your documents",
    },
    {
        icon: Landmark,
        title: "3. Get Amount",
        desc: "Amount will be sent to your bank account",
    },
];

const CONFETTI = [
    { top: "2px", left: "8px", size: 6, color: "#EC4899" },
    { top: "18px", left: "0px", size: 5, color: "#F59E0B" },
    { top: "38px", left: "6px", size: 4, color: "#6366F1" },
    { top: "4px", left: "70px", size: 5, color: "#22C55E" },
    { top: "26px", left: "82px", size: 6, color: "#F59E0B" },
    { top: "48px", left: "76px", size: 4, color: "#EC4899" },
];

export default function YourLoanApproved() {
    return (
        <div className="min-h-screen w-full bg-[#E7E4DA] flex items-center justify-center py-10 px-4">
            <div className="w-[390px] shrink-0 bg-white rounded-[2.75rem] border-[6px] border-[#0F1B3D] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.35)] overflow-hidden relative">
                {/* status bar */}
                <div className="h-9 bg-white flex items-center justify-between px-7">
                    <span className="text-[11px] font-mono tracking-wide text-[#0F1B3D]">
                        9:41
                    </span>
                    <div className="flex items-center gap-1">
                        <div className="w-3.5 h-2 rounded-[1px] border border-[#0F1B3D]/70" />
                        <div className="w-3.5 h-2 rounded-[1px] border border-[#0F1B3D]/70" />
                    </div>
                </div>

                <div className="max-h-[790px] overflow-y-auto">
                    {/* header */}
                    <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#EEF0F5]">
                        <button type="button" aria-label="Go back" className="text-[#0F1B3D]">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#2A4BDE] flex items-center justify-center shrink-0">
                                <RotateCw size={17} className="text-white" strokeWidth={2.25} />
                            </div>
                            <div>
                                <p className="text-[17px] font-bold text-[#0F1B3D] leading-none">
                                    YourLoan
                                </p>
                                <p className="text-[11px] text-[#8A8F9E] mt-1">
                                    Smart Loans For Business
                                </p>
                            </div>
                        </div>
                        <button type="button" aria-label="Open menu">
                            <Menu size={22} className="text-[#0F1B3D]" strokeWidth={2.25} />
                        </button>
                    </div>

                    {/* approved banner */}
                    <div className="mx-4 mt-4 bg-[#EEF6EF] rounded-2xl p-4 relative overflow-hidden">
                        <div className="relative w-14 h-14 mb-4">
                            {CONFETTI.map((c, i) => (
                                <span
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        top: c.top,
                                        left: c.left,
                                        width: c.size,
                                        height: c.size,
                                        background: c.color,
                                    }}
                                />
                            ))}
                            <div className="w-12 h-12 rounded-full bg-[#1FA24C] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                                    <path
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
                            <div className="max-w-[180px]">
                                <h1 className="text-[22px] font-extrabold leading-[1.15]">
                                    <span className="text-[#0F1B3D]">Your Loan Has</span>
                                    <br />
                                    <span className="text-[#1FA24C]">Been Approved!</span>
                                </h1>
                                <p className="text-[12.5px] text-[#5B6072] leading-relaxed mt-2.5">
                                    Congratulations! Your loan is approved. Submit your KYC
                                    documents to receive the amount in your bank account.
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
                                    ₹ 30,000
                                </p>
                            </div>
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Tenure</p>
                                <p className="text-[15px] font-extrabold text-[#0F1B3D] mt-1">
                                    6 Months
                                </p>
                            </div>
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Interest Rate</p>
                                <p className="text-[15px] font-extrabold text-[#0F1B3D] mt-1">
                                    2.5% p.m.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KYC card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <p className="text-[16px] font-extrabold text-[#0F1B3D] mb-1">
                            Submit Your KYC
                        </p>
                        <p className="text-[12px] text-[#5B6072] mb-4">
                            Complete KYC verification to disburse the loan amount.
                        </p>

                        <div className="border border-[#EEF0F5] rounded-xl divide-y divide-[#EEF0F5]">
                            <div className="flex items-center gap-3 p-3.5">
                                <div className="w-11 h-11 rounded-lg bg-[#FFF3E4] border border-[#F6E3C8] flex items-center justify-center shrink-0">
                                    <Fingerprint size={20} className="text-[#E8792B]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-[#0F1B3D]">
                                        Aadhaar Card
                                    </p>
                                    <p className="text-[10.5px] text-[#8A8F9E] mt-0.5">
                                        Upload clear front side image
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="shrink-0 flex items-center gap-1.5 border border-[#D6DCEA] rounded-lg px-3 py-2 text-[#2A4BDE] text-[12px] font-semibold"
                                >
                                    <Upload size={13} />
                                    Upload
                                </button>
                            </div>

                            <div className="flex items-center gap-3 p-3.5">
                                <div className="w-11 h-11 rounded-lg bg-[#EAF0FD] border border-[#D6E1F9] flex items-center justify-center shrink-0">
                                    <CreditCard size={20} className="text-[#2A4BDE]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-[#0F1B3D]">
                                        PAN Card
                                    </p>
                                    <p className="text-[10.5px] text-[#8A8F9E] mt-0.5">
                                        Upload clear image
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="shrink-0 flex items-center gap-1.5 border border-[#D6DCEA] rounded-lg px-3 py-2 text-[#2A4BDE] text-[12px] font-semibold"
                                >
                                    <Upload size={13} />
                                    Upload
                                </button>
                            </div>
                        </div>

                        <div className="mt-3.5 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-start gap-2.5">
                            <ShieldCheck size={16} className="text-[#2A4BDE] shrink-0 mt-0.5" />
                            <p className="text-[11.5px] text-[#0F1B3D] leading-snug">
                                Your documents are 100% secure and will be used only for
                                verification purposes.
                            </p>
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
                            className="w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2"
                        >
                            Submit KYC Now
                            <ArrowRight size={16} />
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