import React, { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Info,
    User,
    Landmark,
    Hash,
    KeyRound,
    Upload,
    Check,
    Lock,
    RotateCw,
    FileImage,
} from "lucide-react";

const ACCOUNT_TYPES = ["Savings", "Current"];

export default function YourLoanBankDetails() {
    const [accountType, setAccountType] = useState("Savings");
    const [uploaded, setUploaded] = useState(false);

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
                            Add Bank Details
                        </p>
                        <p className="text-[12.5px] text-[#5B6072] mt-1.5 leading-relaxed">
                            We'll transfer your approved loan amount directly to this
                            account.
                        </p>
                    </div>

                    {/* info banner */}
                    <div className="mx-4 mt-4 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#2A4BDE] flex items-center justify-center shrink-0">
                            <Info size={12} className="text-white" strokeWidth={2.5} />
                        </div>
                        <p className="text-[11.5px] text-[#0F1B3D] leading-snug">
                            Please make sure the account belongs to you and details are
                            entered correctly.
                        </p>
                    </div>

                    {/* bank details card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center">
                                <Landmark size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                Account Details
                            </p>
                        </div>

                        <Field label="Account Holder Name" icon={<User size={15} />} placeholder="Enter name as per bank account" />
                        <div className="h-3.5" />
                        <Field label="Bank Name" icon={<Landmark size={15} />} placeholder="e.g. State Bank of India" />
                        <div className="h-3.5" />
                        <Field label="Account Number" icon={<Hash size={15} />} placeholder="Enter account number" type="tel" />
                        <div className="h-3.5" />
                        <Field label="Confirm Account Number" icon={<Hash size={15} />} placeholder="Re-enter account number" type="tel" />
                        <div className="h-3.5" />
                        <Field label="IFSC Code" icon={<KeyRound size={15} />} placeholder="e.g. SBIN0001234" />

                        <div className="h-4" />
                        <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                            Account Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {ACCOUNT_TYPES.map((type) => {
                                const selected = accountType === type;
                                return (
                                    <button
                                        type="button"
                                        key={type}
                                        onClick={() => setAccountType(type)}
                                        className={`flex items-center justify-between rounded-lg border px-3.5 py-3 ${selected
                                                ? "border-[#2A4BDE] bg-[#EAF0FD]"
                                                : "border-[#E7E9F0] bg-white"
                                            }`}
                                    >
                                        <span
                                            className={`text-[13px] font-semibold ${selected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"
                                                }`}
                                        >
                                            {type}
                                        </span>
                                        <Radio selected={selected} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* cheque upload card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center shrink-0">
                                <FileImage size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                Cancelled Cheque / Passbook
                            </p>
                        </div>
                        <p className="text-[11px] text-[#8A8F9E] mb-3.5 ml-[42px]">
                            Helps us verify your account faster
                        </p>

                        <button
                            type="button"
                            onClick={() => setUploaded((v) => !v)}
                            className={`w-full flex items-center justify-between rounded-xl border px-3.5 py-3 ${uploaded
                                    ? "border-[#1FA24C] bg-[#EAF6EC]"
                                    : "border-dashed border-[#D6DCEA] bg-[#F8F9FB]"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${uploaded ? "bg-[#1FA24C]" : "bg-white border border-[#E7E9F0]"
                                        }`}
                                >
                                    {uploaded ? (
                                        <Check size={16} className="text-white" />
                                    ) : (
                                        <Upload size={15} className="text-[#8A8F9E]" />
                                    )}
                                </div>
                                <div className="text-left">
                                    <p className="text-[12.5px] font-semibold text-[#0F1B3D]">
                                        {uploaded ? "cheque_leaf.jpg" : "Upload document"}
                                    </p>
                                    <p className="text-[10.5px] text-[#8A8F9E] mt-0.5">
                                        {uploaded ? "Uploaded successfully" : "JPG or PNG, up to 5MB"}
                                    </p>
                                </div>
                            </div>
                            {!uploaded && (
                                <span className="text-[11.5px] font-semibold text-[#2A4BDE] shrink-0">
                                    Browse
                                </span>
                            )}
                        </button>
                    </div>

                    {/* trust strip */}
                    <div className="mx-4 mt-4 flex items-center gap-3 bg-[#EEF3F0] rounded-xl p-3.5">
                        <div className="w-8 h-8 rounded-full bg-[#DCEBE3] flex items-center justify-center shrink-0">
                            <ShieldCheck size={15} className="text-[#1F6F5C]" />
                        </div>
                        <p className="text-[11px] text-[#0F1B3D] leading-snug">
                            Your bank details are encrypted and only used to disburse your
                            loan amount.
                        </p>
                    </div>

                    {/* submit button */}
                    <div className="px-4 mt-5">
                        <button
                            type="button"
                            className="w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2"
                        >
                            Save &amp; Continue
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

function Field({ label, icon, placeholder, type = "text" }) {
    return (
        <div>
            <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                {label}
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#E7E9F0] px-3 py-2.5">
                <span className="text-[#8A8F9E] shrink-0">{icon}</span>
                <input
                    type={type}
                    placeholder={placeholder}
                    className="flex-1 min-w-0 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-transparent"
                />
            </div>
        </div>
    );
}

function Radio({ selected }) {
    return (
        <div
            className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${selected ? "border-[#2A4BDE]" : "border-[#C7CCD6]"
                }`}
        >
            {selected && <div className="w-[7px] h-[7px] rounded-full bg-[#2A4BDE]" />}
        </div>
    );
}