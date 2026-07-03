import React, { useState, useMemo } from "react";
import {
    ArrowLeft,
    ArrowRight,
    User,
    Phone,
    Mail,
    ShieldCheck,
    Lock,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP } from "../redux/slice/authSlice";
import {
    onlyDigits,
    onlyLetters,
    validateEmail,
    validateName,
    validatePhone,
} from "../utils/validation";

const STEPS = [
    { id: "1", label: "Enter Details" },
    { id: "2", label: "Verify" },
    { id: "3", label: "Get Started" },
];

function LoanIcon() {
    return (
        <svg viewBox="0 0 40 40" className="w-9 h-9">
            <circle cx="20" cy="20" r="20" fill="#2F6BFF" />
            <path
                d="M12 14a9 9 0 0 1 15.5-4.2"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <path d="M27 6.5 L28.5 11 L24 10.2 Z" fill="#FFFFFF" />
            <path
                d="M28 26a9 9 0 0 1-15.5 4.2"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />
            <path d="M13 33.5 L11.5 29 L16 29.8 Z" fill="#FFFFFF" />
            <text
                x="20"
                y="25"
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill="#FFFFFF"
                fontFamily="sans-serif"
            >
                ₹
            </text>
        </svg>
    );
}

function ClipboardIllustration() {
    return (
        <div className="relative w-[110px] h-[110px] shrink-0">
            <div className="absolute -inset-2 rounded-full bg-[#DCE8FF]" />
            <svg viewBox="0 0 120 120" className="relative w-full h-full">
                <rect
                    x="28"
                    y="18"
                    width="60"
                    height="80"
                    rx="8"
                    fill="#FFFFFF"
                    stroke="#0F1B3D"
                    strokeWidth="3"
                />
                <rect x="44" y="14" width="28" height="12" rx="4" fill="#0F1B3D" />
                <circle cx="46" cy="38" r="6" fill="#C7D6F5" />
                <circle cx="46" cy="38" r="6" fill="#2F6BFF" fillOpacity="0.25" />
                <circle cx="46" cy="35.5" r="3" fill="#2F6BFF" />
                <path
                    d="M40 44c1-3 4-4 6-4s5 1 6 4"
                    fill="#2F6BFF"
                />
                <rect x="58" y="34" width="20" height="4" rx="2" fill="#DCE1EE" />
                <rect x="58" y="42" width="20" height="4" rx="2" fill="#DCE1EE" />
                <rect x="38" y="56" width="40" height="4" rx="2" fill="#DCE1EE" />
                <rect x="38" y="64" width="40" height="4" rx="2" fill="#DCE1EE" />
                <rect x="38" y="72" width="26" height="4" rx="2" fill="#DCE1EE" />
                <g transform="translate(66,66)">
                    <path
                        d="M18 0 L34 6 V18 C34 30 26 37 18 40 C10 37 2 30 2 18 V6 Z"
                        fill="#2F6BFF"
                        stroke="#0F1B3D"
                        strokeWidth="2.5"
                    />
                    <path
                        d="M10 20 L16 26 L27 13"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
}

export default function OnPocketLogin() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [focused, setFocused] = useState(null);
    const [formError, setFormError] = useState(null);

    const navigate = useNavigate();

    const handleContinue = async () => {
        if (isValid) {
            try {
                const mobile = formattedPhone.replace(/\D/g, "");
                const validationError =
                    validateName(name, "Full name") ||
                    validatePhone(mobile) ||
                    validateEmail(email);

                if (validationError) {
                    setFormError(validationError);
                    return;
                }

                const result = await dispatch(
                    sendOTP({
                        mobile,
                        fullName: name.trim(),
                        email: email.trim(),
                    })
                ).unwrap();

                localStorage.setItem(
                    "pendingAuth",
                    JSON.stringify({
                        mobile,
                        fullName: name.trim(),
                        email: email.trim(),
                        otp: result.otp,
                    })
                );

                navigate("/verify-otp");
            } catch {
                // The slice owns the error message shown below the button.
            }
        }
    };

    const formattedPhone = useMemo(() => {
        const digits = phone.replace(/\D/g, "").slice(0, 10);
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }, [phone]);

    const isValid =
        !validateName(name, "Full name") &&
        formattedPhone.replace(/\D/g, "").length === 10 &&
        !validatePhone(formattedPhone) &&
        !validateEmail(email);

    return (
        <div className="min-h-screen w-full bg-[#EEF0F5] flex items-center justify-center py-10 px-4">
            {/* Phone frame */}
            <div className="w-[390px] shrink-0 bg-[#F5F6FA] rounded-[2rem] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                <div className="max-h-[900px] overflow-y-auto">
                    {/* Header */}
                    <div className="bg-white px-6 pt-6 pb-5 border-b border-[#ECEDF3]">
                        <button
                            type="button"
                            aria-label="Go back"
                            className="text-[#0F1B3D] hover:opacity-70 transition-opacity mb-6"
                        >
                            <ArrowLeft size={20} strokeWidth={2.25} />
                        </button>

                        <div className="flex items-center gap-3">
                            <LoanIcon />
                            <div>
                                <p className="text-[#0F1B3D] font-bold text-[19px] leading-none">
                                    OnPocket
                                </p>
                                <p className="text-[#8A8F9E] text-[12px] mt-1 tracking-wide">
                                    Smart Loans For Business
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step Tracker */}
                    <div className="bg-[#F0F2F8] px-6 py-6">
                        <div className="flex items-start">
                            {STEPS.map((step, i) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center gap-2 w-16">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${
                                                i === 0
                                                    ? "bg-[#2F6BFF] text-white"
                                                    : "bg-white border border-[#D6D9E3] text-[#A6ABB8]"
                                            }`}
                                        >
                                            {step.id}
                                        </div>
                                        <span
                                            className={`text-[11px] text-center leading-tight ${
                                                i === 0
                                                    ? "text-[#2F6BFF] font-semibold"
                                                    : "text-[#9CA1AF]"
                                            }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="flex-1 border-t-2 border-dotted border-[#C7CBD8] mt-4 mx-[-8px]" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-6 pt-7 pb-6 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2F6BFF] bg-[#DCE8FF] px-3 py-1.5 rounded-full mb-4">
                                <User size={13} strokeWidth={2.5} />
                                Apply for Personal Loan
                            </p>
                            <h1 className="font-extrabold text-[30px] leading-[1.15] text-[#0F1B3D] mb-3">
                                Let&apos;s Get Started!
                            </h1>
                            <p className="text-[13.5px] text-[#6B7080] leading-relaxed">
                                Enter your basic details to check your eligibility and
                                proceed further.
                            </p>
                        </div>
                        <ClipboardIllustration />
                    </div>

                    {/* Form Card */}
                    <div className="mx-6 bg-white rounded-2xl border border-[#ECEDF3] p-5 shadow-sm">
                        <h2 className="text-[16px] font-bold text-[#0F1B3D] mb-1">
                            Please enter your details
                        </h2>
                        <p className="text-[12.5px] text-[#8A8F9E] mb-5">
                            We&apos;ll use this information to assist you better.
                        </p>

                        {/* Full Name */}
                        <div className="mb-4">
                            <label className="text-[12.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                                Full Name
                            </label>
                            <div
                                className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors ${
                                    focused === "name"
                                        ? "border-[#2F6BFF]"
                                        : "border-[#E3E5EC]"
                                }`}
                            >
                                <User size={16} className="text-[#9AA0AE] shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(onlyLetters(e.target.value).slice(0, 60));
                                        setFormError(null);
                                    }}
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    className="flex-1 min-w-0 text-[14px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-4">
                            <label className="text-[12.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                                Mobile Number
                            </label>
                            <div
                                className={`flex items-center rounded-xl border transition-colors ${
                                    focused === "phone"
                                        ? "border-[#2F6BFF]"
                                        : "border-[#E3E5EC]"
                                }`}
                            >
                                <div className="flex items-center gap-1 pl-3.5 pr-3 py-3 border-r border-[#E3E5EC] text-[#0F1B3D] text-[14px]">
                                    <Phone size={15} className="text-[#9AA0AE]" />
                                    <span className="ml-1">+91</span>
                                    <ChevronDown size={14} className="text-[#9AA0AE] ml-1" />
                                </div>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="Enter your mobile number"
                                    value={formattedPhone}
                                    onChange={(e) => {
                                        setPhone(onlyDigits(e.target.value, 10));
                                        setFormError(null);
                                    }}
                                    onFocus={() => setFocused("phone")}
                                    onBlur={() => setFocused(null)}
                                    className="flex-1 min-w-0 px-3.5 py-3 text-[14px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Email ID */}
                        <div className="mb-5">
                            <label className="text-[12.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                                Email ID
                            </label>
                            <div
                                className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors ${
                                    focused === "email"
                                        ? "border-[#2F6BFF]"
                                        : "border-[#E3E5EC]"
                                }`}
                            >
                                <Mail size={16} className="text-[#9AA0AE] shrink-0" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value.trim());
                                        setFormError(null);
                                    }}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    className="flex-1 min-w-0 text-[14px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            type="button"
                            disabled={!isValid || loading}
                            onClick={handleContinue}
                            className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 text-[15px] font-semibold transition-all ${
                                isValid
                                    ? "bg-[#2F6BFF] text-white hover:bg-[#2558D6] active:scale-[0.99]"
                                    : "bg-[#2F6BFF] text-white opacity-90"
                            }`}
                        >
                            {loading ? "Sending OTP..." : "Continue"}
                            <ArrowRight size={16} />
                        </button>

                        {(formError || error) && (
                            <p className="text-[11.5px] text-red-600 mt-3 text-center">
                                {formError || error}
                            </p>
                        )}

                        {/* Security Text */}
                        <p className="flex items-center justify-center gap-1.5 text-[11.5px] text-[#9AA0AE] mt-3.5">
                            <Lock size={11} />
                            Your information is safe and secure with us.
                        </p>
                    </div>

                    {/* Trust Strip */}
                    <div className="mx-6 mt-4 mb-3 flex items-center gap-3 bg-[#EAF3EE] rounded-2xl p-4">
                        <div className="w-10 h-10 rounded-full bg-[#DCEBE3] flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} className="text-[#1F6F5C]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-[#0F1B3D] leading-tight">
                                100% Safe &amp; Secure
                            </p>
                            <p className="text-[11.5px] text-[#6B7080] leading-snug mt-0.5">
                                We do not share your details with any third party.
                            </p>
                        </div>
                        <div className="shrink-0">
                            <svg viewBox="0 0 60 68" className="w-11 h-13">
                                <path
                                    d="M30 2 L56 12 V34 C56 50 45 60 30 66 C15 60 4 50 4 34 V12 Z"
                                    fill="none"
                                    stroke="#22A06B"
                                    strokeWidth="2"
                                />
                                <text
                                    x="30"
                                    y="30"
                                    textAnchor="middle"
                                    fontSize="8"
                                    fontWeight="700"
                                    fill="#22A06B"
                                    fontFamily="sans-serif"
                                >
                                    SECURE
                                </text>
                                <text
                                    x="30"
                                    y="45"
                                    textAnchor="middle"
                                    fontSize="9"
                                    fontWeight="700"
                                    fill="#22A06B"
                                    fontFamily="sans-serif"
                                >
                                    100%
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center py-5">
                        <span className="text-[13px] text-[#6B7080]">
                            Already have an account?{" "}
                        </span>
                        <button
                            type="button"
                            className="text-[13px] font-semibold text-[#2F6BFF]"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
