import React, { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    ShieldCheck,
    Lock,
    BadgeIndianRupee,
    Check,
    Loader2,
} from "lucide-react";

const STEPS = [
    { id: "01", label: "Enter details" },
    { id: "02", label: "Verify" },
    { id: "03", label: "Get started" },
];

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
        <div className="min-h-screen w-full bg-[#E7E4DA] flex items-center justify-center py-10 px-4">
            <div className="w-[390px] shrink-0 bg-[#FBFAF6] rounded-[2.75rem] border-[6px] border-[#14203D] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.35)] overflow-hidden relative">
                {/* status bar */}
                <div className="h-9 bg-[#14203D] flex items-center justify-between px-7 text-[#FBFAF6]">
                    <span className="text-[11px] font-mono tracking-wide">9:41</span>
                    <div className="flex items-center gap-1">
                        <div className="w-3.5 h-2 rounded-[1px] border border-[#FBFAF6]/70" />
                        <div className="w-3.5 h-2 rounded-[1px] border border-[#FBFAF6]/70" />
                    </div>
                </div>

                <div className="max-h-[790px] overflow-y-auto">
                    {/* header */}
                    <div className="bg-[#14203D] px-6 pt-5 pb-8">
                        <button
                            type="button"
                            aria-label="Go back"
                            className="text-[#FBFAF6]/70 hover:text-[#FBFAF6] transition-colors mb-6"
                        >
                            <ArrowLeft size={20} />
                        </button>

                        <div className="flex items-center gap-2.5 mb-8">
                            <div className="w-9 h-9 rounded-full bg-[#C89B3C] flex items-center justify-center shrink-0">
                                <BadgeIndianRupee size={18} className="text-[#14203D]" strokeWidth={2.25} />
                            </div>
                            <div>
                                <p className="text-[#FBFAF6] font-serif text-[17px] leading-none">YourLoan</p>
                                <p className="text-[#FBFAF6]/55 text-[11px] mt-1 tracking-wide">
                                    Smart loans for business
                                </p>
                            </div>
                        </div>

                        {/* step tracker — step 1 done, step 2 active */}
                        <div className="flex items-center">
                            {STEPS.map((step, i) => {
                                const done = i === 0;
                                const active = i === 1;
                                return (
                                    <React.Fragment key={step.id}>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] border ${done
                                                        ? "bg-[#C89B3C]/25 border-[#C89B3C] text-[#C89B3C]"
                                                        : active
                                                            ? "bg-[#C89B3C] border-[#C89B3C] text-[#14203D]"
                                                            : "border-[#FBFAF6]/30 text-[#FBFAF6]/50"
                                                    }`}
                                            >
                                                {done ? <Check size={13} /> : step.id}
                                            </div>
                                            <span
                                                className={`text-[10px] tracking-wide ${active ? "text-[#FBFAF6]" : "text-[#FBFAF6]/45"
                                                    }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {i < STEPS.length - 1 && (
                                            <div
                                                className={`flex-1 h-px mx-2 -mt-4 ${done ? "bg-[#C89B3C]/60" : "bg-[#FBFAF6]/20"
                                                    }`}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* headline */}
                    <div className="px-6 pt-7 pb-5">
                        <p className="inline-block text-[11px] font-mono tracking-wider text-[#8A6B22] bg-[#F2E4C2] px-2.5 py-1 rounded-full mb-4">
                            VERIFY YOUR NUMBER
                        </p>
                        <h1 className="font-serif text-[28px] leading-[1.15] text-[#14203D] mb-2">
                            Enter the OTP
                        </h1>
                        <p className="text-[13.5px] text-[#5B6072] leading-relaxed">
                            We've sent a 4-digit code to{" "}
                            <span className="font-medium text-[#14203D]">
                                +91 {phoneNumber}
                            </span>
                        </p>
                    </div>

                    {/* card */}
                    <div className="mx-6 bg-white rounded-2xl border border-[#E7E4DA] p-5">
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
                                    className={`w-14 h-14 rounded-xl border flex items-center justify-center font-mono text-[22px] text-[#14203D] transition-all text-center outline-none
                                        ${status === "redirecting" ? "border-[#C89B3C] bg-[#F2E4C2]" : ""}
                                        ${digit
                                            ? "border-[#14203D] bg-[#FBFAF6]"
                                            : "border-[#E7E4DA] bg-white"
                                        } 
                                        ${status === "verified" ? "border-[#1F6F5C] bg-[#EEF3F0]" : ""}
                                        ${status === "verifying" ? "opacity-50 cursor-not-allowed" : ""}
                                        focus:border-[#14203D] focus:ring-2 focus:ring-[#14203D]/20`}
                                    autoFocus={i === 0}
                                />
                            ))}
                        </div>

                        <div className="text-center mt-4 min-h-[20px]">
                            {status === "waiting" && (
                                <p className="text-[12px] text-[#8A8F9E]">
                                    Waiting for code&hellip;
                                </p>
                            )}
                            {status === "filling" && (
                                <p className="text-[12px] text-[#8A8F9E]">
                                    Auto-reading OTP from SMS&hellip;
                                </p>
                            )}
                            {status === "verifying" && (
                                <p className="text-[12px] text-[#8A8F9E] flex items-center justify-center gap-2">
                                    <Loader2 size={14} className="animate-spin" />
                                    Verifying OTP with server&hellip;
                                </p>
                            )}
                            {status === "redirecting" && (
                                <p className="text-[12px] text-[#C89B3C] font-medium flex items-center justify-center gap-2">
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
                            className={`w-full mt-5 h-12 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium transition-all ${
                                status === "redirecting"
                                    ? "bg-[#C89B3C] text-[#14203D]"
                                    : status === "verified"
                                        ? "bg-[#1F6F5C] text-[#FBFAF6]"
                                        : status === "verifying"
                                            ? "bg-[#14203D] text-[#FBFAF6]"
                                            : "bg-[#EDEBE3] text-[#A9ACB6]"
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

                        <p className="text-center text-[12px] text-[#5B6072] mt-4">
                            {timer > 0 ? (
                                <>
                                    Resend code in{" "}
                                    <span className="font-mono text-[#14203D]">
                                        0:{timer.toString().padStart(2, "0")}
                                    </span>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={status === "verifying" || status === "verified" || status === "redirecting"}
                                    className={`font-medium underline underline-offset-2 ${
                                        status === "verifying" || status === "verified" || status === "redirecting"
                                            ? "text-[#A9ACB6] cursor-not-allowed"
                                            : "text-[#14203D] hover:text-[#C89B3C]"
                                    }`}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </p>
                    </div>

                    {/* trust strip */}
                    <div className="mx-6 mt-4 mb-3 flex items-center gap-3 bg-[#EEF3F0] rounded-xl p-4">
                        <div className="w-9 h-9 rounded-full bg-[#DCEBE3] flex items-center justify-center shrink-0">
                            <ShieldCheck size={17} className="text-[#1F6F5C]" />
                        </div>
                        <div>
                            <p className="text-[12.5px] font-medium text-[#14203D] leading-tight">
                                100% safe and secure
                            </p>
                            <p className="text-[11px] text-[#5B6072] leading-snug mt-0.5">
                                We never share your details with any third party.
                            </p>
                        </div>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F9E] pb-6">
                        <Lock size={11} />
                        Your information is safe and secure with us
                    </p>
                </div>
            </div>
        </div>
    );
}