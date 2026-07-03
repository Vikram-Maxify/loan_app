import React, { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Info,
    User,
    Phone,
    Mail,
    CreditCard,
    Target,
    Users,
    Briefcase,
    Check,
    Pencil,
    Lock,
    RotateCw,
    FileCheck2,
    Loader2,
} from "lucide-react";

const STEPS = [
    { id: "1", label: "Personal Details" },
    { id: "2", label: "Additional Details" },
    { id: "3", label: "Review & Submit" },
];

const PERSONAL_ROWS = [
    { icon: User, label: "Full Name", value: "Prince Kumar" },
    { icon: Phone, label: "Mobile Number", value: "+91 9876543210" },
    { icon: Mail, label: "Email ID", value: "princekumar@gmail.com" },
    { icon: CreditCard, label: "Aadhaar Number", value: "1234 5678 9012" },
    { icon: CreditCard, label: "PAN Number", value: "ABCDE1234F" },
];

const LOAN_ROWS = [
    { icon: Target, label: "Purpose of Loan", value: "Business Expansion" },
    { icon: Users, label: "Reference Contact", value: "Ramesh Kumar (Brother)" },
    { icon: Briefcase, label: "Employment Type", value: "Self Employed" },
];

const KYC_ROWS = [
    { label: "Aadhaar Card", file: "aadhaar_front.jpg" },
    { label: "PAN Card", file: "pan_card.jpg" },
];

export default function YourLoanReviewSubmit() {
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Function to simulate API call
    const submitApplication = async () => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Prepare all application data
            const applicationData = {
                personalDetails: {
                    fullName: "Prince Kumar",
                    mobile: "9876543210",
                    email: "princekumar@gmail.com",
                    aadhaar: "1234 5678 9012",
                    pan: "ABCDE1234F",
                },
                loanDetails: {
                    purpose: "Business Expansion",
                    referenceContact: "Ramesh Kumar (Brother)",
                    employmentType: "Self Employed",
                },
                kycDocuments: [
                    { type: "Aadhaar Card", file: "aadhaar_front.jpg" },
                    { type: "PAN Card", file: "pan_card.jpg" },
                ],
                cibilData: JSON.parse(localStorage.getItem("cibilData") || "{}"),
                applicationId: "APP_" + Date.now(),
                submittedAt: new Date().toISOString(),
                status: "pending",
            };

            // Real API call - Replace with actual endpoint
            // const response = await fetch('/api/loan-application/submit', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': 'Bearer ' + localStorage.getItem('token')
            //     },
            //     body: JSON.stringify(applicationData)
            // });
            // 
            // if (!response.ok) {
            //     throw new Error('Failed to submit application');
            // }
            // 
            // const data = await response.json();
            // 
            // if (!data.success) {
            //     throw new Error(data.message || 'Submission failed');
            // }

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simulate successful response
            const success = true;
            
            if (success) {
                // Store the application data
                localStorage.setItem("loanApplication", JSON.stringify(applicationData));
                localStorage.setItem("applicationStatus", "approved");
                localStorage.setItem("applicationId", applicationData.applicationId);

                // Navigate to approved page
                window.location.href = "/approvedpage";
            } else {
                throw new Error("Application submission failed. Please try again.");
            }
        } catch (error) {
            setSubmitError(error.message || "Network error. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (agreed && !isSubmitting) {
            submitApplication();
        }
    };

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
                        <button 
                            type="button" 
                            aria-label="Go back" 
                            className="text-[#0F1B3D] shrink-0"
                            disabled={isSubmitting}
                        >
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

                    {/* step tracker */}
                    <div className="px-6 py-5 border-b border-[#EEF0F5]">
                        <div className="flex items-center">
                            {STEPS.map((step, i) => {
                                const done = i < 2;
                                const active = i === 2;
                                return (
                                    <React.Fragment key={step.id}>
                                        <div className="flex flex-col items-center gap-1.5 w-[76px]">
                                            <div
                                                className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${done || active
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

                    {/* info banner */}
                    <div className="mx-4 mt-4 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#2A4BDE] flex items-center justify-center shrink-0">
                            <Info size={12} className="text-white" strokeWidth={2.5} />
                        </div>
                        <p className="text-[11.5px] text-[#0F1B3D] leading-snug">
                            Please review your details carefully before submitting.
                        </p>
                    </div>

                    {/* personal details summary */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center">
                                    <User size={16} className="text-[#2A4BDE]" />
                                </div>
                                <p className="text-[15px] font-bold text-[#0F1B3D]">
                                    Personal Details
                                </p>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-1 text-[#2A4BDE] text-[11.5px] font-semibold"
                                disabled={isSubmitting}
                            >
                                <Pencil size={12} />
                                Edit
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {PERSONAL_ROWS.map((row) => (
                                <div key={row.label} className="flex items-center gap-3">
                                    <row.icon size={14} className="text-[#8A8F9E] shrink-0" />
                                    <span className="text-[11.5px] text-[#8A8F9E] w-[108px] shrink-0">
                                        {row.label}
                                    </span>
                                    <span className="text-[12.5px] font-semibold text-[#0F1B3D] text-right flex-1">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* loan details summary */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center">
                                    <Briefcase size={16} className="text-[#2A4BDE]" />
                                </div>
                                <p className="text-[15px] font-bold text-[#0F1B3D]">
                                    Loan &amp; Employment Details
                                </p>
                            </div>
                            <button
                                type="button"
                                className="flex items-center gap-1 text-[#2A4BDE] text-[11.5px] font-semibold"
                                disabled={isSubmitting}
                            >
                                <Pencil size={12} />
                                Edit
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {LOAN_ROWS.map((row) => (
                                <div key={row.label} className="flex items-center gap-3">
                                    <row.icon size={14} className="text-[#8A8F9E] shrink-0" />
                                    <span className="text-[11.5px] text-[#8A8F9E] w-[108px] shrink-0">
                                        {row.label}
                                    </span>
                                    <span className="text-[12.5px] font-semibold text-[#0F1B3D] text-right flex-1">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KYC summary */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-3.5">
                            <div className="w-8 h-8 rounded-lg bg-[#EAF6EC] flex items-center justify-center">
                                <FileCheck2 size={16} className="text-[#1FA24C]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                KYC Documents
                            </p>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {KYC_ROWS.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center justify-between bg-[#F8F9FB] rounded-xl px-3 py-2.5"
                                >
                                    <div>
                                        <p className="text-[12.5px] font-semibold text-[#0F1B3D]">
                                            {row.label}
                                        </p>
                                        <p className="text-[10.5px] text-[#8A8F9E] mt-0.5">
                                            {row.file}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[#1FA24C] text-[11px] font-semibold">
                                        <Check size={13} />
                                        Uploaded
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* terms checkbox */}
                    <div className="mx-4 mt-4">
                        <button
                            type="button"
                            onClick={() => !isSubmitting && setAgreed((v) => !v)}
                            disabled={isSubmitting}
                            className={`w-full flex items-start gap-3 bg-white border border-[#EEF0F5] rounded-2xl p-4 text-left ${
                                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${agreed
                                        ? "bg-[#2A4BDE] border-[#2A4BDE]"
                                        : "border-[#C7CCD6] bg-white"
                                    }`}
                            >
                                {agreed && <Check size={13} className="text-white" />}
                            </div>
                            <p className="text-[12px] text-[#5B6072] leading-relaxed">
                                I confirm that the information provided is accurate and I
                                agree to the{" "}
                                <span className="text-[#2A4BDE] font-semibold">
                                    Terms &amp; Conditions
                                </span>{" "}
                                and{" "}
                                <span className="text-[#2A4BDE] font-semibold">
                                    Privacy Policy
                                </span>
                                .
                            </p>
                        </button>
                    </div>

                    {/* Error message */}
                    {submitError && (
                        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                            <p className="text-[12px] text-red-600 flex items-center gap-2">
                                <span className="text-red-500">⚠</span>
                                {submitError}
                            </p>
                        </div>
                    )}

                    {/* submit button */}
                    <div className="px-4 mt-5">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!agreed || isSubmitting}
                            className={`w-full h-12 rounded-xl font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
                                agreed && !isSubmitting
                                    ? "bg-[#2A4BDE] text-white hover:bg-[#1A3BAE] active:scale-[0.99]"
                                    : "bg-[#EDEBE3] text-[#A9ACB6] cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Submitting Application...
                                </>
                            ) : (
                                <>
                                    Submit Application
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