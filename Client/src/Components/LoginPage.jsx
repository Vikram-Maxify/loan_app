import React, { useState, useMemo, useEffect } from "react";
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
import OwnPocketHeader from "./Header";

const STEPS = [
    { id: "1", label: "Enter Details" },
    { id: "2", label: "Verify" },
    { id: "3", label: "Get Started" },
];

// Improved email validation function
const isValidEmail = (email) => {
    if (!email || email.trim() === "") return true; // Empty is valid (optional)

    // More comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
};

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

export default function OwnPocketLogin() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const pendingAuth = JSON.parse(localStorage.getItem("pendingAuth") || "{}");

    const [name, setName] = useState(pendingAuth.fullName || "");
    const [phone, setPhone] = useState(() => {
        const mobile = pendingAuth.mobile || "";
        return mobile.replace(/\D/g, "");
    });
    const [email, setEmail] = useState(pendingAuth.email || "");
    const [focused, setFocused] = useState(null);
    const [formError, setFormError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const [nameError, setNameError] = useState(null);
    const [emailError, setEmailError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (window.fbq) {
            window.fbq("track", "PageView");
            window.fbq("track", "ViewContent", {
                content_name: "Loan Details Form",
            });
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(
            "pendingAuth",
            JSON.stringify({
                ...pendingAuth,
                mobile: phone.replace(/\D/g, ""),
                fullName: name.trim(),
                email: email.trim(),
            })
        );
    }, [name, phone, email]);

    // Validate name on blur
    const handleNameBlur = () => {
        if (name.trim().length > 0 && name.trim().length < 2) {
            setNameError("Please enter your full name (minimum 2 characters)");
        } else if (name.trim().length > 0 && !validateName(name, "Full name")) {
            setNameError("Please enter a valid name (letters only)");
        } else {
            setNameError(null);
        }
    };

    // Validate email on blur - FIXED
    const handleEmailBlur = () => {
        if (email.trim().length > 0 && !isValidEmail(email)) {
            setEmailError("Please enter a valid email address (e.g., name@domain.com)");
        } else {
            setEmailError(null);
        }
    };

    const handleContinue = async () => {
        const mobile = phone.replace(/\D/g, "");

        // Validate phone number length
        if (mobile.length !== 10) {
            setPhoneError("Please enter a valid 10-digit mobile number");
            return;
        }

        // Validate name
        if (!name.trim() || name.trim().length < 2) {
            setNameError("Please enter your full name (minimum 2 characters)");
            return;
        }

        // Validate email - FIXED
        if (email.trim() && !isValidEmail(email)) {
            setEmailError("Please enter a valid email address (e.g., name@domain.com)");
            return;
        }

        try {
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

            if (window.fbq) {
                window.fbq("track", "Lead");
            }

            navigate("/verify-otp");
        } catch (err) {
            setFormError(err.message || "Failed to send OTP. Please try again.");
        }
    };

    // Format phone for display only
    const formattedPhone = useMemo(() => {
        const digits = phone.replace(/\D/g, "").slice(0, 10);
        if (digits.length <= 4) return digits;
        if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
        return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
    }, [phone]);

    // Get raw digits from phone
    const rawPhoneDigits = phone.replace(/\D/g, "");

    // Get validation state
    const getPhoneValidationState = () => {
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 0) return 'empty';
        if (digits.length === 10) return 'valid';
        return 'invalid';
    };

    const phoneState = getPhoneValidationState();

    // FIXED: Check if all fields are valid with improved email validation
    const isValid = useMemo(() => {
        const isNameValid = name.trim().length >= 2;
        const isPhoneValid = rawPhoneDigits.length === 10;
        const isEmailValid = !email.trim() || isValidEmail(email);

        return isNameValid && isPhoneValid && isEmailValid;
    }, [name, rawPhoneDigits, email]);

    // Debug logging - remove in production
    useEffect(() => {
        console.log("Validation Status:", {
            name: name.trim(),
            nameLength: name.trim().length,
            isNameValid: name.trim().length >= 2,
            phone: rawPhoneDigits,
            phoneLength: rawPhoneDigits.length,
            isPhoneValid: rawPhoneDigits.length === 10,
            email: email,
            isEmailValid: !email.trim() || isValidEmail(email),
            isValid: isValid,
            emailValidationResult: email.trim() ? isValidEmail(email) : "empty"
        });
    }, [name, rawPhoneDigits, email, isValid]);

    // Handle phone change - store only digits
    const handlePhoneChange = (value) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, "").slice(0, 10);
        setPhone(digits);
        setFormError(null);
        setPhoneError(null);
    };

    const handlePhoneBlur = () => {
        const mobile = phone.replace(/\D/g, "");
        if (mobile.length > 0 && mobile.length !== 10) {
            setPhoneError("Please enter a valid 10-digit mobile number");
        } else {
            setPhoneError(null);
        }
    };

    // Get field border color
    const getFieldBorder = (field) => {
        if (focused === field) return "border-[#2F6BFF]";
        if (field === 'name' && nameError) return "border-red-500";
        if (field === 'phone' && phoneError) return "border-red-500";
        if (field === 'email' && emailError) return "border-red-500";
        return "border-[#E3E5EC]";
    };

    return (
        <div className="w-full bg-[#EEF0F5] flex items-center justify-center">
            {/* Phone frame */}
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                <div className="overflow-y-auto">
                    {/* Header */}
                    <OwnPocketHeader />

                    {/* Step Tracker */}
                    <div className="bg-[#F0F2F8] px-6 py-6">
                        <div className="flex items-start">
                            {STEPS.map((step, i) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center gap-2 w-16">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${i === 0
                                                ? "bg-[#2F6BFF] text-white"
                                                : "bg-white border border-[#D6D9E3] text-[#A6ABB8]"
                                                }`}
                                        >
                                            {step.id}
                                        </div>
                                        <span
                                            className={`text-[11px] text-center leading-tight ${i === 0
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
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div
                                className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors ${getFieldBorder('name')}`}
                            >
                                <User size={16} className="text-[#9AA0AE] shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(onlyLetters(e.target.value).slice(0, 60));
                                        setFormError(null);
                                        setNameError(null);
                                    }}
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => {
                                        setFocused(null);

                                    }}
                                    className="flex-1 min-w-0 text-[14px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                                />
                                {name.trim().length >= 2 && (
                                    <span className="text-emerald-500 text-xs">✓</span>
                                )}
                            </div>
                            {nameError && (
                                <p className="text-[11.5px] text-red-500 mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                    {nameError}
                                </p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-4">
                            <label className="text-[12.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div
                                className={`flex items-center rounded-xl border transition-colors ${getFieldBorder('phone')}`}
                            >
                                <div className="flex items-center gap-1 pl-3.5 pr-3 py-3 border-r border-[#E3E5EC] text-[#0F1B3D] text-[14px]">
                                    <Phone size={15} className="text-[#9AA0AE]" />
                                    <span className="ml-1">+91</span>
                                    <ChevronDown size={14} className="text-[#9AA0AE] ml-1" />
                                </div>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    placeholder="Enter 10-digit mobile number"
                                    value={formattedPhone}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    onFocus={() => setFocused("phone")}
                                    onBlur={() => {
                                        setFocused(null);
                                        handlePhoneBlur();
                                    }}
                                    className="flex-1 min-w-0 px-3.5 py-3 text-[14px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                                />
                                {phoneState === 'valid' && (
                                    <span className="text-emerald-500 text-xs mr-3">✓</span>
                                )}
                            </div>
                            {phoneError && (
                                <p className="text-[11.5px] text-red-500 mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                    {phoneError}
                                </p>
                            )}
                            <div className="flex justify-between mt-1">
                                <span className={`text-[10px] ${phoneState === 'valid'
                                    ? "text-emerald-500"
                                    : phoneState === 'invalid'
                                        ? "text-amber-500"
                                        : "text-[#B5B9C4]"
                                    }`}>
                                    {phone.replace(/\D/g, "").length}/10 digits
                                </span>
                                {phoneState === 'valid' && (
                                    <span className="text-[10px] text-emerald-500">✓ Valid</span>
                                )}
                                {phoneState === 'invalid' && phone.replace(/\D/g, "").length > 0 && (
                                    <span className="text-[10px] text-amber-500">Need 10 digits</span>
                                )}
                            </div>
                        </div>

                        {/* Email ID - FIXED with better validation */}
                        <div className="mb-5">
                            <label className="text-[12.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                                Email ID <span className="text-gray-400 text-xs">(optional)</span>
                            </label>
                            <div
                                className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-colors ${getFieldBorder('email')}`}
                            >
                                <Mail size={16} className="text-[#9AA0AE] shrink-0" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setFormError(null);
                                        setEmailError(null);
                                    }}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => {
                                        setFocused(null);
                                        handleEmailBlur();
                                    }}
                                    className="flex-1 min-w-0 text-[14px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                                />
                                {email.trim() && isValidEmail(email) && (
                                    <span className="text-emerald-500 text-xs">✓</span>
                                )}
                            </div>
                            {emailError && (
                                <p className="text-[11.5px] text-red-500 mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                                    {emailError}
                                </p>
                            )}
                            {email.trim() && !isValidEmail(email) && !emailError && (
                                <p className="text-[11.5px] text-amber-500 mt-1.5 flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 rounded-full bg-amber-500"></span>
                                    Please enter a valid email address
                                </p>
                            )}
                        </div>

                        {/* Continue Button */}
                        <button
                            type="button"
                            disabled={!isValid || loading}
                            onClick={handleContinue}
                            className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 text-[15px] font-semibold transition-all ${isValid && !loading
                                ? "bg-[#2F6BFF] text-white hover:bg-[#2558D6] active:scale-[0.99] cursor-pointer"
                                : "bg-[#2F6BFF] text-white opacity-60 cursor-not-allowed"
                                }`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>

                        {/* Show why button is disabled */}
                        {!isValid && !loading && (
                            <div className="mt-3 text-center">
                                <p className="text-[11px] text-amber-600">
                                    {!name.trim() || name.trim().length < 2 ? "⚠️ Please enter your full name" :
                                        rawPhoneDigits.length !== 10 ? "⚠️ Please enter 10-digit mobile number" :
                                            email.trim() && !isValidEmail(email) ? "⚠️ Please enter valid email address" :
                                                "⚠️ Please fill all required fields"}
                                </p>
                            </div>
                        )}

                        {/* Combined Error Display */}
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