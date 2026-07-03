import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Info,
    User,
    Landmark,
    Hash,
    KeyRound,
    Lock,
    RotateCw,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBankDraft, updateAccountDetails } from "../redux/slice/applicationSlice";
import {
    onlyDigits,
    onlyLetters,
    uppercaseAlnum,
    validateBankAccount,
    validateIFSC,
    validateName,
} from "../utils/validation";
import OwnPocketHeader from "../Components/Header";

const ACCOUNT_TYPES = ["Savings", "Current"];

export default function OwnPocketBankDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, bankDraft } = useSelector((state) => state.application);
    const [accountType, setAccountType] = useState(bankDraft?.accountType || "Savings");
    const uploaded = false;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Form data state
    const [formData, setFormData] = useState({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifscCode: "",
        ...bankDraft,
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        setSubmitError(null);
    };

    const validateForm = () => {
        const nextErrors = {
            accountHolderName: validateName(formData.accountHolderName, "Account holder name"),
            bankName: validateName(formData.bankName, "Bank name"),
            accountNumber: validateBankAccount(formData.accountNumber),
            confirmAccountNumber:
                formData.accountNumber === formData.confirmAccountNumber
                    ? ""
                    : "Account numbers do not match",
            ifscCode: validateIFSC(formData.ifscCode),
        };

        const firstError = Object.values(nextErrors).find(Boolean);
        setFieldErrors(nextErrors);
        if (firstError) {
            setSubmitError(firstError);
            return false;
        }
        return true;
    };

    const submitBankDetails = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setSubmitError(null);

            const bankData = {
                accountHolderName: formData.accountHolderName,
                bankName: formData.bankName,
                accountNumber: formData.accountNumber,
                confirmAccountNumber: formData.confirmAccountNumber,
                ifscCode: formData.ifscCode.toUpperCase(),
                accountType,
                cancelledChequeOrPassbook: uploaded ? "uploaded" : "",
            };
            dispatch(setBankDraft(bankData));

            const applicationId = localStorage.getItem("applicationId");
            if (!applicationId) {
                throw new Error("Application not found. Please submit the application first.");
            }

            const response = await dispatch(
                updateAccountDetails({
                    applicationId,
                    accountDetails: bankData,
                })
            ).unwrap();

            localStorage.setItem("application", JSON.stringify(response.data));
            localStorage.setItem("bankDetails", JSON.stringify(bankData));

            navigate("/processing-fee");
        } catch (error) {
            setSubmitError(error?.message || error || "Failed to save bank details. Please try again.");
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        // Scroll to top on route change
        window.scrollTo(0, 0);
      }, []);
    

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center">
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                {/* status bar */}

                <div className="  overflow-y-auto">
                    {/* header */}
                    <OwnPocketHeader />

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

                        <Field
                            label="Account Holder Name"
                            icon={<User size={15} />}
                            placeholder="Enter name as per bank account"
                            value={formData.accountHolderName}
                            onChange={(val) => handleInputChange('accountHolderName', onlyLetters(val).slice(0, 60))}
                            disabled={isSubmitting}
                            error={fieldErrors.accountHolderName}
                        />
                        <div className="h-3.5" />

                        <Field
                            label="Bank Name"
                            icon={<Landmark size={15} />}
                            placeholder="e.g. State Bank of India"
                            value={formData.bankName}
                            onChange={(val) => handleInputChange('bankName', onlyLetters(val).slice(0, 60))}
                            disabled={isSubmitting}
                            error={fieldErrors.bankName}
                        />
                        <div className="h-3.5" />

                        <Field
                            label="Account Number"
                            icon={<Hash size={15} />}
                            placeholder="Enter account number"
                            type="tel"
                            value={formData.accountNumber}
                            onChange={(val) => handleInputChange('accountNumber', onlyDigits(val, 18))}
                            disabled={isSubmitting}
                            maxLength={18}
                            inputMode="numeric"
                            error={fieldErrors.accountNumber}
                        />
                        <div className="h-3.5" />

                        <Field
                            label="Confirm Account Number"
                            icon={<Hash size={15} />}
                            placeholder="Re-enter account number"
                            type="tel"
                            value={formData.confirmAccountNumber}
                            onChange={(val) => handleInputChange('confirmAccountNumber', onlyDigits(val, 18))}
                            disabled={isSubmitting}
                            maxLength={18}
                            inputMode="numeric"
                            error={fieldErrors.confirmAccountNumber}
                        />
                        <div className="h-3.5" />

                        <Field
                            label="IFSC Code"
                            icon={<KeyRound size={15} />}
                            placeholder="e.g. SBIN0001234"
                            value={formData.ifscCode}
                            onChange={(val) => handleInputChange('ifscCode', uppercaseAlnum(val, 11))}
                            disabled={isSubmitting}
                            maxLength={11}
                            error={fieldErrors.ifscCode}
                        />

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
                                        onClick={() => !isSubmitting && setAccountType(type)}
                                        disabled={isSubmitting}
                                        className={`flex items-center justify-between rounded-lg border px-3.5 py-3 ${selected
                                                ? "border-[#2A4BDE] bg-[#EAF0FD]"
                                                : "border-[#E7E9F0] bg-white"
                                            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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


                    {/* Error message */}
                    {(submitError || error) && (
                        <div className="mx-4 mt-3 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                            <p className="text-[11.5px] text-red-600 flex items-center gap-2">
                                <span className="text-red-500">⚠</span>
                                {submitError || error}
                            </p>
                        </div>
                    )}

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
                            onClick={submitBankDetails}
                            disabled={isSubmitting || loading}
                            className={`w-full h-12 rounded-xl font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${isSubmitting || loading
                                    ? "bg-[#2A4BDE] text-white opacity-70 cursor-not-allowed"
                                    : "bg-[#2A4BDE] text-white hover:bg-[#1A3BAE] active:scale-[0.99]"
                                }`}
                        >
                            {isSubmitting || loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving Details...
                                </>
                            ) : (
                                <>
                                    Save &amp; Continue
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

function Field({ label, icon, placeholder, type = "text", value, onChange, disabled, error, inputMode, maxLength }) {
    return (
        <div>
            <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                {label}
            </label>
            <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${disabled ? "bg-[#F8F9FB]" : "bg-white"
                } ${error ? "border-red-300" : "border-[#E7E9F0]"}`}>
                <span className="text-[#8A8F9E] shrink-0">{icon}</span>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    inputMode={inputMode}
                    maxLength={maxLength}
                    className={`flex-1 min-w-0 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-transparent ${disabled ? "cursor-not-allowed" : ""
                        }`}
                />
            </div>
            {error && <p className="text-[10.5px] text-red-600 mt-1">{error}</p>}
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
