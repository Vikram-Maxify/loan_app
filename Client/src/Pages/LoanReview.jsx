import React, { useEffect, useMemo, useState } from "react";
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
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { acceptApplicationTerms } from "../redux/slice/applicationSlice";
import OwnPocketHeader from "../Components/Header";

const STEPS = [
    { id: "1", label: "Personal Details" },
    { id: "2", label: "Additional Details" },
    { id: "3", label: "Review & Submit" },
];

export default function OwnPocketReviewSubmit() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, application, formDraft, cibilData, bankDraft } = useSelector((state) => state.application);
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const persistedApplication = useMemo(() => JSON.parse(localStorage.getItem("application") || "null"), []);
    const persistedDraft = useMemo(() => JSON.parse(localStorage.getItem("applicationFormDraft") || "null"), []);
    const persistedCibil = useMemo(() => JSON.parse(localStorage.getItem("cibilData") || "null"), []);
    const persistedBank = useMemo(() => JSON.parse(localStorage.getItem("bankDetails") || "null"), []);

    const sourceApplication = application || persistedApplication || {};
    const sourceDraft = formDraft || persistedDraft || {};
    const sourceForm = sourceDraft.formData || {};
    const sourceCibil = cibilData || persistedCibil || {};
    const sourceBank = bankDraft || persistedBank || {};
    const reference = sourceApplication.relativesReferenceContact || {};
    const accountDetails = sourceApplication.accountDetails || sourceBank || {};
    const valueOrMissing = (value) => value || "Not provided";

    const personalRows = [
        { icon: User, label: "Full Name", value: valueOrMissing(sourceApplication.fullName || sourceForm.fullName) },
        { icon: Phone, label: "Mobile Number", value: valueOrMissing(sourceApplication.mobileNumber || sourceForm.mobile) },
        { icon: Mail, label: "Email ID", value: valueOrMissing(sourceApplication.email || sourceForm.email) },
        { icon: CreditCard, label: "Aadhaar Number", value: valueOrMissing(sourceApplication.aadhaarNumber || sourceForm.aadhaar) },
        { icon: CreditCard, label: "PAN Number", value: valueOrMissing(sourceApplication.panNumber || sourceForm.pan) },
    ];

    const loanRows = [
        { icon: Target, label: "Purpose of Loan", value: valueOrMissing(sourceApplication.forPurposeOfLoan || sourceDraft.purpose) },
        {
            icon: Users,
            label: "Reference Contact",
            value: reference.relativesName || sourceForm.relativeName
                ? `${reference.relativesName || sourceForm.relativeName} (${reference.relationship || sourceForm.relationship || "Relationship not provided"})`
                : "Not provided",
        },
        { icon: Briefcase, label: "Employment Type", value: valueOrMissing(sourceApplication.whatDoYouDo || sourceDraft.employmentLabel) },
        {
            icon: Target,
            label: "Loan Amount",
            value: sourceCibil.selectedAmount ? `₹ ${Number(sourceCibil.selectedAmount).toLocaleString("en-IN")}` : "Not provided",
        },
    ];

    const bankRows = [
        { icon: User, label: "Account Holder", value: valueOrMissing(accountDetails.accountHolderName) },
        { icon: Briefcase, label: "Bank Name", value: valueOrMissing(accountDetails.bankName) },
        { icon: CreditCard, label: "Account Number", value: valueOrMissing(accountDetails.accountNumber) },
        { icon: CreditCard, label: "IFSC Code", value: valueOrMissing(accountDetails.ifscCode) },
    ];

    const submitApplication = async () => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const applicationId = localStorage.getItem("applicationId");
            if (!applicationId) {
                throw new Error("Application data is missing. Please complete the application form first.");
            }

            const response = await dispatch(
                acceptApplicationTerms({
                    applicationId,
                    termsAccepted: true,
                })
            ).unwrap();
            localStorage.setItem("application", JSON.stringify(response.data));

            localStorage.setItem("applicationStatus", "approved");

            // Facebook Meta Pixel
            if (window.fbq) {
                window.fbq("track", "Lead");
                window.fbq("track", "CompleteRegistration");
            }

            navigate("/approvedpage");
        } catch (error) {
            setSubmitError(error?.message || error || "Network error. Please check your connection and try again.");
            setIsSubmitting(false);
        }
    };

    const handleSubmit = () => {
        if (agreed && !isSubmitting && !loading) {
            submitApplication();
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);

        if (window.fbq) {
            window.fbq("track", "PageView");
            window.fbq("track", "ViewContent", {
                content_name: "Loan Review",
            });
        }
    }, []);


    return (
        <div className=" w-full bg-white flex items-center justify-center">
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                <div className="  overflow-y-auto">
                    {/* header */}
                    <OwnPocketHeader />

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
                            {personalRows.map((row) => (
                                <div key={row.label} className="flex items-center gap-3">
                                    <row.icon size={14} className="text-[#8A8F9E] shrink-0" />
                                    <span className="text-[11.5px] text-[#8A8F9E] w-[108px] shrink-0">
                                        {row.label}
                                    </span>
                                    <span
                                        className={`flex-1 min-w-0 text-[12.5px] font-semibold text-[#0F1B3D] text-right ${row.label === "Email ID"
                                            ? "truncate"
                                            : "whitespace-nowrap"
                                            }`}
                                        title={row.value}
                                    >
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
                            {loanRows.map((row) => (
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



                    {/* terms checkbox */}
                    <div className="mx-4 mt-4">
                        <button
                            type="button"
                            onClick={() => !isSubmitting && setAgreed((v) => !v)}
                            disabled={isSubmitting}
                            className={`w-full flex items-start gap-3 bg-white border border-[#EEF0F5] rounded-2xl p-4 text-left ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
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
                    {(submitError || error) && (
                        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                            <p className="text-[12px] text-red-600 flex items-center gap-2">
                                <span className="text-red-500">⚠</span>
                                {submitError || error}
                            </p>
                        </div>
                    )}

                    {/* submit button */}
                    <div className="px-4 mt-5">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!agreed || isSubmitting || loading}
                            className={`w-full h-12 rounded-xl font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${agreed && !isSubmitting && !loading
                                ? "bg-[#2A4BDE] text-white hover:bg-[#1A3BAE] active:scale-[0.99]"
                                : "bg-[#EDEBE3] text-[#A9ACB6] cursor-not-allowed"
                                }`}
                        >
                            {isSubmitting || loading ? (
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
