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
    ChevronDown,
    Briefcase,
    Building2,
    Landmark,
    UserX,
    Lock,
    Check,
    RotateCw,
    Loader2,
} from "lucide-react";

const STEPS = [
    { id: "1", label: "Personal Details" },
    { id: "2", label: "Additional Details" },
    { id: "3", label: "Review & Submit" },
];

const PURPOSES = [
    "Business Expansion",
    "Working Capital",
    "Machinery Purchase",
    "Inventory Purchase",
    "Shop / Office Setup",
    "Other",
];

const EMPLOYMENT = [
    { icon: User, label: ["Self", "Employed"] },
    { icon: Building2, label: ["Employed", "(Private)"] },
    { icon: Landmark, label: ["Government", "Employed"] },
    { icon: UserX, label: ["Not", "Employed"] },
];

export default function YourLoanApplicationForm() {
    const [purpose, setPurpose] = useState("Business Expansion");
    const [employment, setEmployment] = useState("Self");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Form data state
    const [formData, setFormData] = useState({
        fullName: "Prince Kumar",
        mobile: "9876543210",
        email: "princekumar@gmail.com",
        aadhaar: "1234 5678 9012",
        pan: "ABCDE1234F",
        relativeName: "",
        relativeMobile: "",
        relationship: "",
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSubmitError(null);
    };

    // Realistic API call simulation
    const submitApplication = async () => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Prepare data for API
            const payload = {
                personalDetails: {
                    fullName: formData.fullName,
                    mobile: formData.mobile,
                    email: formData.email,
                    aadhaar: formData.aadhaar,
                    pan: formData.pan,
                },
                loanPurpose: purpose,
                employmentType: employment,
                reference: {
                    name: formData.relativeName,
                    mobile: formData.relativeMobile,
                    relationship: formData.relationship,
                },
                timestamp: new Date().toISOString(),
            };

            // Simulate API call - Replace this with actual API endpoint
            // const response = await fetch('/api/loan-application', {
            //     method: 'POST',
            //     headers: { 
            //         'Content-Type': 'application/json',
            //         'Authorization': 'Bearer ' + localStorage.getItem('token')
            //     },
            //     body: JSON.stringify(payload)
            // });
            // const data = await response.json();

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Simulate API response
            const success = true;
            const applicationId = "APP_" + Date.now();

            if (success) {
                // Store application data locally
                localStorage.setItem("loanApplication", JSON.stringify({
                    ...payload,
                    applicationId,
                    status: "pending",
                    submittedAt: new Date().toISOString(),
                }));

                // Navigate to CIBIL check page
                window.location.href = "/cibilcheck";
            } else {
                setSubmitError("Failed to submit application. Please try again.");
            }
        } catch (error) {
            setSubmitError("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinue = () => {
        // Validate required fields before submission
        if (!formData.relativeName.trim()) {
            setSubmitError("Please enter relative's name");
            return;
        }
        if (!formData.relativeMobile.trim() || formData.relativeMobile.replace(/\D/g, "").length < 10) {
            setSubmitError("Please enter a valid relative's mobile number");
            return;
        }
        if (!formData.relationship) {
            setSubmitError("Please select relationship with relative");
            return;
        }

        submitApplication();
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
                            {STEPS.map((step, i) => (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center gap-1.5 w-[76px]">
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${i === 0
                                                    ? "bg-[#2A4BDE] text-white"
                                                    : "border border-[#D6DCEA] text-[#8A8F9E]"
                                                }`}
                                        >
                                            {step.id}
                                        </div>
                                        <span
                                            className={`text-[9.5px] text-center leading-tight font-semibold ${i === 0 ? "text-[#2A4BDE]" : "text-[#8A8F9E] font-medium"
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div className="flex-1 h-px border-t border-dashed border-[#D6DCEA] -mt-5" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* info banner */}
                    <div className="mx-4 mt-4 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#2A4BDE] flex items-center justify-center shrink-0">
                            <Info size={12} className="text-white" strokeWidth={2.5} />
                        </div>
                        <p className="text-[11.5px] text-[#0F1B3D] leading-snug">
                            Please fill in the details below. All fields are mandatory.
                        </p>
                    </div>

                    {/* personal details card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center">
                                <User size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                Personal Details
                            </p>
                        </div>

                        <TextField 
                            label="Full Name" 
                            icon={<User size={15} />} 
                            value={formData.fullName}
                            onChange={(val) => handleInputChange('fullName', val)}
                        />
                        <div className="h-3.5" />

                        <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                            Mobile Number
                        </label>
                        <div className="flex items-center rounded-xl border border-[#E7E9F0]">
                            <div className="flex items-center gap-1 pl-3 pr-2.5 py-2.5 border-r border-[#E7E9F0] text-[#0F1B3D] text-[13px]">
                                <Phone size={14} className="text-[#8A8F9E]" />
                                +91
                                <ChevronDown size={13} className="text-[#8A8F9E]" />
                            </div>
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                className="flex-1 min-w-0 px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-transparent"
                            />
                        </div>
                        <div className="h-3.5" />

                        <TextField 
                            label="Email ID" 
                            icon={<Mail size={15} />} 
                            value={formData.email}
                            onChange={(val) => handleInputChange('email', val)}
                        />
                        <div className="h-3.5" />
                        <TextField
                            label="Aadhaar Card Number"
                            icon={<CreditCard size={15} />}
                            value={formData.aadhaar}
                            onChange={(val) => handleInputChange('aadhaar', val)}
                        />
                        <div className="h-3.5" />
                        <TextField
                            label="PAN Card Number"
                            icon={<CreditCard size={15} />}
                            value={formData.pan}
                            onChange={(val) => handleInputChange('pan', val)}
                        />
                    </div>

                    {/* purpose of loan card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center shrink-0">
                                <Target size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                For (Purpose of Loan)
                            </p>
                        </div>
                        <p className="text-[11px] text-[#8A8F9E] mb-3.5 ml-[42px]">
                            Select the main purpose of your loan
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                            {PURPOSES.map((p) => {
                                const selected = purpose === p;
                                return (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setPurpose(p)}
                                        disabled={isSubmitting}
                                        className={`flex items-start justify-between gap-1 rounded-lg border p-2.5 text-left ${selected
                                                ? "border-[#2A4BDE] bg-[#EAF0FD]"
                                                : "border-[#E7E9F0] bg-white"
                                            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <span
                                            className={`text-[10.5px] leading-tight font-semibold ${selected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"
                                                }`}
                                        >
                                            {p}
                                        </span>
                                        <Radio selected={selected} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* relatives card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center shrink-0">
                                <Users size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                Relatives / Reference Contact
                            </p>
                        </div>
                        <p className="text-[11px] text-[#8A8F9E] mb-3.5 ml-[42px]">
                            Please provide details of a close relative or reference
                        </p>

                        <select
                            value={formData.relationship}
                            onChange={(e) => handleInputChange('relationship', e.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-xl border border-[#E7E9F0] px-3 py-2.5 text-[13px] text-[#0F1B3D] outline-none appearance-none bg-white"
                        >
                            <option value="">Select Relationship</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Parent">Parent</option>
                            <option value="Child">Child</option>
                            <option value="Sibling">Sibling</option>
                            <option value="Friend">Friend</option>
                            <option value="Colleague">Colleague</option>
                        </select>
                        <div className="h-3.5" />

                        <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                            Relative's Name
                        </label>
                        <input
                            placeholder="Enter full name"
                            value={formData.relativeName}
                            onChange={(e) => handleInputChange('relativeName', e.target.value)}
                            disabled={isSubmitting}
                            className="w-full rounded-xl border border-[#E7E9F0] px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-white disabled:opacity-50"
                        />
                        <div className="h-3.5" />

                        <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                            Mobile Number
                        </label>
                        <div className="flex items-center rounded-xl border border-[#E7E9F0]">
                            <div className="flex items-center gap-1 pl-3 pr-2.5 py-2.5 border-r border-[#E7E9F0] text-[#0F1B3D] text-[13px]">
                                <Phone size={14} className="text-[#8A8F9E]" />
                                +91
                                <ChevronDown size={13} className="text-[#8A8F9E]" />
                            </div>
                            <input
                                placeholder="Enter mobile number"
                                value={formData.relativeMobile}
                                onChange={(e) => handleInputChange('relativeMobile', e.target.value)}
                                disabled={isSubmitting}
                                className="flex-1 min-w-0 px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-transparent disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* employment card */}
                    <div className="mx-4 mt-4 mb-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center shrink-0">
                                <Briefcase size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                What Do You Do?
                            </p>
                        </div>
                        <p className="text-[11px] text-[#8A8F9E] mb-3.5 ml-[42px]">
                            Select your employment type
                        </p>

                        <div className="grid grid-cols-4 gap-2">
                            {EMPLOYMENT.map((e) => {
                                const selected = employment === e.label[0];
                                return (
                                    <button
                                        type="button"
                                        key={e.label[0]}
                                        onClick={() => setEmployment(e.label[0])}
                                        disabled={isSubmitting}
                                        className={`flex flex-col rounded-lg border p-2 ${selected
                                                ? "border-[#2A4BDE] bg-[#EAF0FD]"
                                                : "border-[#E7E9F0] bg-white"
                                            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <e.icon
                                                size={16}
                                                className={selected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"}
                                            />
                                            <Radio selected={selected} small />
                                        </div>
                                        <span
                                            className={`text-[9.5px] leading-tight font-semibold text-left ${selected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"
                                                }`}
                                        >
                                            {e.label[0]}
                                            <br />
                                            {e.label[1]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error message */}
                    {submitError && (
                        <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                            <p className="text-[12px] text-red-600 flex items-center gap-2">
                                <span className="text-red-500">⚠</span>
                                {submitError}
                            </p>
                        </div>
                    )}

                    {/* continue button */}
                    <div className="px-4 pb-2">
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={isSubmitting}
                            className={`w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
                                isSubmitting 
                                    ? "opacity-70 cursor-not-allowed" 
                                    : "hover:bg-[#1A3BAE] active:scale-[0.99]"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Submitting Application...
                                </>
                            ) : (
                                <>
                                    Continue
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

function TextField({ label, icon, value, onChange }) {
    return (
        <div>
            <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                {label}
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#E7E9F0] px-3 py-2.5">
                <span className="text-[#8A8F9E] shrink-0">{icon}</span>
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 min-w-0 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                />
            </div>
        </div>
    );
}

function Radio({ selected, small }) {
    const size = small ? "w-3.5 h-3.5" : "w-4 h-4";
    return (
        <div
            className={`${size} rounded-full border shrink-0 flex items-center justify-center ${selected ? "border-[#2A4BDE]" : "border-[#C7CCD6]"
                }`}
        >
            {selected && (
                <div className="w-[7px] h-[7px] rounded-full bg-[#2A4BDE]" />
            )}
        </div>
    );
}