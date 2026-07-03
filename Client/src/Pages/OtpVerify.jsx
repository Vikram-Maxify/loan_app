import React, { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    ShieldCheck,
    Lock,
    Check,
    Loader2,
} from "lucide-react";

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

export default function YourLoanOtpVerify() {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [status, setStatus] = useState("waiting"); // waiting | filling | verifying | verified | redirecting
    const [timer, setTimer] = useState(30);
    const generatedOtp = useRef(
        String(Math.floor(1000 + Math.random() * 9000)).split("")
    );
    const [error, setError] = useState(null);

    const phoneNumber = "98765 43210";

    // simulate OTP arriving and auto-filling digit by digit
    useEffect(() => {
        const startDelay = setTimeout(() => {
            setStatus("filling");
            generatedOtp.current.forEach((digit, i) => {
                setTimeout(() => {
                    setOtp((prev) => {
                        const next = [...prev];
                        next[i] = digit;
                        return next;
                    });
                }, i * 260);
            });
        }, 900);
        return () => clearTimeout(startDelay);
    }, []);

    // auto-submit once all 4 digits are filled
    useEffect(() => {
        if (otp.every((d) => d !== "") && status === "filling") {
            const submitDelay = setTimeout(() => {
                setStatus("verifying");
                verifyOtp(otp.join(""));
            }, 400);
            return () => clearTimeout(submitDelay);
        }
    }, [otp, status]);

    // resend countdown
    useEffect(() => {
        if (timer === 0) return;
        const t = setTimeout(() => setTimer((s) => s - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

    // Realistic API call simulation
    const verifyOtp = async (enteredOtp) => {
        try {
            // Simulate API request
            setError(null);

            // This is where you would make your actual API call
            // For example:
            // const response = await fetch('/api/verify-otp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ otp: enteredOtp, phone: phoneNumber })
            // });
            // const data = await response.json();

            // Simulating API delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Simulate API response
            const success = true; // In real scenario, this would come from the API

            if (success) {
                setStatus("verified");

                // Store user session data (simulating API response)
                const userData = {
                    id: "user_" + Date.now(),
                    name: "John Doe",
                    phone: phoneNumber,
                    email: "john@example.com",
                    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Simulated JWT
                };

                // Store in localStorage/sessionStorage
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("isAuthenticated", "true");

                // Wait a moment to show the verified state before redirecting
                setTimeout(() => {
                    setStatus("redirecting");
                    // Navigate to home page
                    window.location.href = "/home";
                }, 1200);
            } else {
                setError("Invalid OTP. Please try again.");
                setStatus("filling");
                setOtp(["", "", "", ""]);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setStatus("filling");
            setOtp(["", "", "", ""]);
        }
    };

    // Manual OTP input handler (for users who want to type manually)
    const handleOtpChange = (index, value) => {
        if (status === "verifying" || status === "verified" || status === "redirecting") return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(0, 1);
        setOtp(newOtp);
        setError(null);

        // Auto-submit when all digits are filled
        if (newOtp.every((d) => d !== "")) {
            setStatus("verifying");
            verifyOtp(newOtp.join(""));
        }
    };

    // Handle key events for navigation
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const input = document.getElementById(`otp-${index - 1}`);
            if (input) input.focus();
        }
    };

    // Resend OTP handler
    const handleResend = () => {
        setTimer(30);
        setError(null);
        setStatus("waiting");
        setOtp(["", "", "", ""]);

        // Generate new OTP
        generatedOtp.current = String(Math.floor(1000 + Math.random() * 9000)).split("");

        // Resend simulation
        setTimeout(() => {
            setStatus("filling");
            generatedOtp.current.forEach((digit, i) => {
                setTimeout(() => {
                    setOtp((prev) => {
                        const next = [...prev];
                        next[i] = digit;
                        return next;
                    });
                }, i * 260);
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full bg-[#EEF0F5] flex items-center justify-center py-10 px-4">
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
                                    YourLoan
                                </p>
                                <p className="text-[#8A8F9E] text-[12px] mt-1 tracking-wide">
                                    Smart Loans For Business
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step Tracker — step 1 done, step 2 active */}
                    <div className="bg-[#F0F2F8] px-6 py-6">
                        <div className="flex items-start">
                            {STEPS.map((step, i) => {
                                const done = i === 0;
                                const active = i === 1;
                                return (
                                    <React.Fragment key={step.id}>
                                        <div className="flex flex-col items-center gap-2 w-16">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${
                                                    done
                                                        ? "bg-[#DCE8FF] text-[#2F6BFF]"
                                                        : active
                                                        ? "bg-[#2F6BFF] text-white"
                                                        : "bg-white border border-[#D6D9E3] text-[#A6ABB8]"
                                                }`}
                                            >
                                                {done ? <Check size={14} /> : step.id}
                                            </div>
                                            <span
                                                className={`text-[11px] text-center leading-tight ${
                                                    active
                                                        ? "text-[#2F6BFF] font-semibold"
                                                        : done
                                                        ? "text-[#0F1B3D] font-medium"
                                                        : "text-[#9CA1AF]"
                                                }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {i < STEPS.length - 1 && (
                                            <div
                                                className={`flex-1 border-t-2 mt-4 mx-[-8px] ${
                                                    done
                                                        ? "border-dotted border-[#2F6BFF]"
                                                        : "border-dotted border-[#C7CBD8]"
                                                }`}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="px-6 pt-7 pb-6">
                        <p className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2F6BFF] bg-[#DCE8FF] px-3 py-1.5 rounded-full mb-4">
                            <Lock size={13} strokeWidth={2.5} />
                            Verify Your Number
                        </p>
                        <h1 className="font-extrabold text-[30px] leading-[1.15] text-[#0F1B3D] mb-3">
                            Enter the OTP
                        </h1>
                        <p className="text-[13.5px] text-[#6B7080] leading-relaxed">
                            We&apos;ve sent a 4-digit code to{" "}
                            <span className="font-semibold text-[#0F1B3D]">
                                +91 {phoneNumber}
                            </span>
                        </p>
                    </div>

                    {/* Card */}
                    <div className="mx-6 bg-white rounded-2xl border border-[#ECEDF3] p-5 shadow-sm">
                        <div className="flex items-center justify-center gap-3 py-2">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    disabled={status === "verifying" || status === "verified" || status === "redirecting"}
                                    className={`w-14 h-14 rounded-xl border flex items-center justify-center text-[22px] font-semibold text-[#0F1B3D] transition-all text-center outline-none
                                        ${status === "redirecting" ? "border-[#2F6BFF] bg-[#DCE8FF]" : ""}
                                        ${digit
                                            ? "border-[#2F6BFF] bg-[#F5F8FF]"
                                            : "border-[#E3E5EC] bg-white"
                                        }
                                        ${status === "verified" ? "border-[#1F6F5C] bg-[#EAF3EE]" : ""}
                                        ${status === "verifying" ? "opacity-50 cursor-not-allowed" : ""}
                                        focus:border-[#2F6BFF] focus:ring-2 focus:ring-[#2F6BFF]/20`}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        <div className="text-center mt-4 min-h-[20px]">
                            {status === "waiting" && (
                                <p className="text-[12px] text-[#9AA0AE]">
                                    Waiting for code&hellip;
                                </p>
                            )}
                            {status === "filling" && (
                                <p className="text-[12px] text-[#9AA0AE]">
                                    Auto-reading OTP from SMS&hellip;
                                </p>
                            )}
                            {status === "verifying" && (
                                <p className="text-[12px] text-[#9AA0AE] flex items-center justify-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    Verifying OTP with server&hellip;
                                </p>
                            )}
                            {status === "redirecting" && (
                                <p className="text-[12px] text-[#2F6BFF] font-medium flex items-center justify-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    Redirecting to dashboard&hellip;
                                </p>
                            )}
                            {error && (
                                <p className="text-[12px] text-red-500 font-medium">
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            disabled
                            className={`w-full mt-5 h-12 rounded-xl flex items-center justify-center gap-2 text-[15px] font-semibold transition-all ${
                                status === "redirecting"
                                    ? "bg-[#DCE8FF] text-[#2F6BFF]"
                                    : status === "verified"
                                    ? "bg-[#1F6F5C] text-white"
                                    : status === "verifying"
                                    ? "bg-[#2F6BFF] text-white"
                                    : "bg-[#EDEEF3] text-[#A9ACB6]"
                            }`}
                        >
                            {status === "redirecting" && (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Redirecting...
                                </>
                            )}
                            {status === "verifying" && (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Verifying
                                </>
                            )}
                            {status === "verified" && (
                                <>
                                    <Check size={16} />
                                    Verified
                                </>
                            )}
                            {(status === "waiting" || status === "filling") && "Verify OTP"}
                        </button>

                        <p className="text-center text-[12px] text-[#6B7080] mt-4">
                            {timer > 0 ? (
                                <>
                                    Resend code in{" "}
                                    <span className="font-semibold text-[#0F1B3D]">
                                        0:{timer.toString().padStart(2, "0")}
                                    </span>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={status === "verifying" || status === "verified" || status === "redirecting"}
                                    className={`font-semibold ${
                                        status === "verifying" || status === "verified" || status === "redirecting"
                                            ? "text-[#A9ACB6] cursor-not-allowed"
                                            : "text-[#2F6BFF] hover:text-[#2558D6]"
                                    }`}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </p>
                    </div>

                    {/* Trust Strip */}
                    <div className="mx-6 mt-4 mb-3 flex items-center gap-3 bg-[#EAF3EE] rounded-2xl p-4">
                        <div className="w-10 h-10 rounded-full bg-[#DCEBE3] flex items-center justify-center shrink-0">
                            <ShieldCheck size={18} className="text-[#1F6F5C]" />
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-[#0F1B3D] leading-tight">
                                100% Safe &amp; Secure
                            </p>
                            <p className="text-[11.5px] text-[#6B7080] leading-snug mt-0.5">
                                We do not share your details with any third party.
                            </p>
                        </div>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-[11.5px] text-[#9AA0AE] pb-6">
                        <Lock size={11} />
                        Your information is safe and secure with us.
                    </p>
                </div>
            </div>
        </div>
    );
}