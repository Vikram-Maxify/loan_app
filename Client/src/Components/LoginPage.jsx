import React, { useState, useMemo } from "react";
import {
    ArrowLeft,
    ArrowRight,
    User,
    Phone,
    Mail,
    ShieldCheck,
    Lock,
    BadgeIndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = [
    { id: "01", label: "Enter details" },
    { id: "02", label: "Verify" },
    { id: "03", label: "Get started" },
];

export default function YourLoanLogin() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [focused, setFocused] = useState(null);

    const navigate = useNavigate();

const handleContinue = () => {
    if (isValid) {
        navigate('/verify-otp');
    }
};

    const formattedPhone = useMemo(() => {
        const digits = phone.replace(/\D/g, "").slice(0, 10);
        if (digits.length <= 5) return digits;
        return `${digits.slice(0, 5)} ${digits.slice(5)}`;
    }, [phone]);

    const isValid =
        name.trim().length > 1 &&
        formattedPhone.replace(/\D/g, "").length === 10 &&
        /\S+@\S+\.\S+/.test(email);

    return (
        <div className="min-h-screen w-full bg-[#E7E4DA] flex items-center justify-center py-10 px-4">
            {/* Fixed phone-width frame — stays this width on desktop too */}
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

                        {/* signature step tracker — passbook ledger style */}
                        <div className="flex items-center">
                            {STEPS.map((step, i) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center gap-2">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] border ${i === 0
                                                    ? "bg-[#C89B3C] border-[#C89B3C] text-[#14203D]"
                                                    : "border-[#FBFAF6]/30 text-[#FBFAF6]/50"
                                                }`}
                                        >
                                            {step.id}
                                        </div>
                                        <span
                                            className={`text-[10px] tracking-wide ${i === 0 ? "text-[#FBFAF6]" : "text-[#FBFAF6]/45"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="flex-1 h-px bg-[#FBFAF6]/20 mx-2 -mt-4" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* headline */}
                    <div className="px-6 pt-7 pb-5">
                        <p className="inline-block text-[11px] font-mono tracking-wider text-[#8A6B22] bg-[#F2E4C2] px-2.5 py-1 rounded-full mb-4">
                            APPLY FOR A BUSINESS LOAN
                        </p>
                        <h1 className="font-serif text-[28px] leading-[1.15] text-[#14203D] mb-2">
                            Let's get you started
                        </h1>
                        <p className="text-[13.5px] text-[#5B6072] leading-relaxed">
                            Share a few details and we'll check your eligibility in under
                            two minutes.
                        </p>
                    </div>

                    {/* form card */}
                    <div className="mx-6 bg-white rounded-2xl border border-[#E7E4DA] p-5">
                        <Field
                            label="Full name"
                            icon={<User size={16} />}
                            placeholder="Enter your full name"
                            value={name}
                            onChange={setName}
                            focused={focused === "name"}
                            onFocus={() => setFocused("name")}
                            onBlur={() => setFocused(null)}
                        />

                        <div className="h-4" />

                        <label className="text-[12px] font-medium text-[#14203D] mb-1.5 block">
                            Mobile number
                        </label>
                        <div
                            className={`flex items-center rounded-xl border transition-colors ${focused === "phone"
                                    ? "border-[#14203D]"
                                    : "border-[#E7E4DA]"
                                }`}
                        >
                            <div className="flex items-center gap-1.5 pl-3 pr-3 py-3 border-r border-[#E7E4DA] text-[#14203D] text-[14px]">
                                <Phone size={15} className="text-[#8A8F9E]" />
                                <span className="font-mono">+91</span>
                            </div>
                            <input
                                type="tel"
                                inputMode="numeric"
                                placeholder="98765 43210"
                                value={formattedPhone}
                                onChange={(e) => setPhone(e.target.value)}
                                onFocus={() => setFocused("phone")}
                                onBlur={() => setFocused(null)}
                                className="flex-1 min-w-0 px-3 py-3 text-[14px] font-mono text-[#14203D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                            />
                        </div>

                        <div className="h-4" />

                        <Field
                            label="Email ID"
                            icon={<Mail size={16} />}
                            placeholder="Enter your email address"
                            value={email}
                            onChange={setEmail}
                            type="email"
                            focused={focused === "email"}
                            onFocus={() => setFocused("email")}
                            onBlur={() => setFocused(null)}
                        />

                        <button
                            type="button"
                            disabled={!isValid}
                            onClick={handleContinue}
                            className={`w-full mt-6 h-12 rounded-xl flex items-center justify-center gap-2 text-[14px] font-medium transition-all ${isValid
                                    ? "bg-[#14203D] text-[#FBFAF6] hover:bg-[#1B2A4D] active:scale-[0.99]"
                                    : "bg-[#EDEBE3] text-[#A9ACB6] cursor-not-allowed"
                                }`}
                        >
                            Continue
                            <ArrowRight size={16} />
                        </button>

                        <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F9E] mt-3.5">
                            <Lock size={11} />
                            Your information is safe and secure with us
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

                    {/* footer */}
                    <div className="text-center py-5">
                        <span className="text-[12.5px] text-[#5B6072]">
                            Already have an account?{" "}
                        </span>
                        <button
                            type="button"
                            className="text-[12.5px] font-medium text-[#14203D] underline underline-offset-2"
                        >
                            Log in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    icon,
    placeholder,
    value,
    onChange,
    type = "text",
    focused,
    onFocus,
    onBlur,
}) {
    return (
        <div>
            <label className="text-[12px] font-medium text-[#14203D] mb-1.5 block">
                {label}
            </label>
            <div
                className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 transition-colors ${focused ? "border-[#14203D]" : "border-[#E7E4DA]"
                    }`}
            >
                <span className="text-[#8A8F9E] shrink-0">{icon}</span>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className="flex-1 min-w-0 text-[14px] text-[#14203D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                />
            </div>
        </div>
    );
}