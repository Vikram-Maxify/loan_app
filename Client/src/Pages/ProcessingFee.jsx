import React, { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Info,
    IndianRupee,
    Percent,
    ReceiptText,
    CircleCheckBig,
    BadgeCheck,
    Lock,
    RotateCw,
    Wallet,
    CreditCard,
    Building2,
    QrCode,
} from "lucide-react";

const PAYMENT_METHODS = [
    { id: "upi", label: "UPI", icon: QrCode },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallet", label: "Wallet", icon: Wallet },
];

const BREAKDOWN = [
    { label: "Processing Fee", value: "₹ 200", emphasis: false },
    { label: "GST (18%)", value: "₹ 59", emphasis: false },
];

export default function YourLoanProcessingFee() {
    const [selectedMethod, setSelectedMethod] = useState("upi");

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
                    <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#EEF0F5]">
                        <button type="button" aria-label="Go back" className="text-[#0F1B3D] shrink-0">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2 flex-1 justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#2A4BDE] flex items-center justify-center shrink-0">
                                <RotateCw size={14} className="text-white" strokeWidth={2.25} />
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-[#0F1B3D] leading-none">
                                    YourLoan
                                </p>
                                <p className="text-[10px] text-[#8A8F9E] mt-0.5">
                                    Smart Loans For Business
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-[#2A4BDE] shrink-0">
                            <ShieldCheck size={14} />
                            <span className="text-[10.5px] font-semibold whitespace-nowrap">
                                100% Secure
                            </span>
                        </div>
                    </div>

                    {/* title block */}
                    <div className="px-5 pt-5 pb-1">
                        <p className="text-[19px] font-extrabold text-[#0F1B3D] leading-tight">
                            Processing Fee Payment
                        </p>
                        <p className="text-[12.5px] text-[#5B6072] mt-1.5 leading-relaxed">
                            Pay the processing fee to initiate your loan disbursal.
                        </p>
                    </div>

                    {/* amount to pay */}
                    <div className="mx-4 mt-4 bg-gradient-to-br from-[#2A4BDE] to-[#1A3BAE] rounded-2xl p-5 text-white">
                        <p className="text-[13px] opacity-80">Total Amount to Pay</p>
                        <p className="text-[42px] font-extrabold tracking-tight mt-1">
                            ₹ 259
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full">
                                ₹ 200 + ₹ 59 GST
                            </span>
                        </div>
                    </div>

                    {/* breakdown card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center">
                                <ReceiptText size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                Fee Breakdown
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {BREAKDOWN.map((row) => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <span className="text-[12.5px] text-[#5B6072]">
                                        {row.label}
                                    </span>
                                    <span className="text-[13px] font-semibold text-[#0F1B3D]">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-[#E7E9F0] my-4" />

                        <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#0F1B3D]">
                                Total Processing Fee
                            </span>
                            <span className="text-[18px] font-extrabold text-[#2A4BDE]">
                                ₹ 259
                            </span>
                        </div>
                        <p className="text-[10.5px] text-[#8A8F9E] mt-1">
                            Inclusive of all taxes and charges.
                        </p>
                    </div>

                    {/* payment methods */}
                    <div className="mx-4 mt-4">
                        <p className="text-[13px] font-semibold text-[#0F1B3D] mb-3">
                            Select Payment Method
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {PAYMENT_METHODS.map((method) => {
                                const Icon = method.icon;
                                const isSelected = selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border-2 transition-all duration-200 ${
                                            isSelected
                                                ? "border-[#2A4BDE] bg-[#EEF4FF]"
                                                : "border-[#E7E9F0] bg-white hover:border-[#BCC8F0]"
                                        }`}
                                    >
                                        <Icon
                                            size={16}
                                            className={isSelected ? "text-[#2A4BDE]" : "text-[#5B6072]"}
                                        />
                                        <span
                                            className={`text-[12px] font-medium ${
                                                isSelected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"
                                            }`}
                                        >
                                            {method.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* regulatory note */}
                    <div className="mx-4 mt-4 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-start gap-2.5">
                        <Info size={15} className="text-[#2A4BDE] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#0F1B3D] leading-snug">
                            This is a one-time processing fee. The amount will be adjusted
                            in your final loan disbursement. All charges are as per RBI
                            guidelines.
                        </p>
                    </div>

                    {/* pay now button */}
                    <div className="px-4 mt-5">
                        <button
                            type="button"
                            className="w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 hover:bg-[#1A3BAE] transition-colors"
                        >
                            Pay ₹ 259 Now
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F9E] py-4">
                        <Lock size={11} />
                        Your payment is secure and encrypted.
                    </p>
                </div>
            </div>
        </div>
    );
}