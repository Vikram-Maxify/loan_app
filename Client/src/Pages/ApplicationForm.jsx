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
    Store,
    Factory,
    Building,
    UserCircle,
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
    { 
        id: "self", 
        icon: User, 
        label: ["Self", "Employed"],
        fields: [
            { label: "Type of Business/Profession", placeholder: "e.g. Retail, Consultancy, etc.", type: "text" },
            { label: "Business/Profession Name", placeholder: "Enter your business name", type: "text" },
            { label: "Years in Business", placeholder: "Number of years", type: "number" },
            { label: "Annual Turnover", placeholder: "e.g. ₹10,00,000", type: "text" },
        ]
    },
    { 
        id: "private", 
        icon: Building2, 
        label: ["Employed", "(Private)"],
        fields: [
            { label: "Company Name", placeholder: "Enter your company name", type: "text" },
            { label: "Designation/Role", placeholder: "Your job title", type: "text" },
            { label: "Department", placeholder: "e.g. IT, Sales, Finance", type: "text" },
            { label: "Years of Experience", placeholder: "Number of years", type: "number" },
            { label: "Monthly Salary", placeholder: "e.g. ₹50,000", type: "text" },
        ]
    },
    { 
        id: "government", 
        icon: Landmark, 
        label: ["Government", "Employed"],
        fields: [
            { label: "Organization Name", placeholder: "Government organization name", type: "text" },
            { label: "Designation/Role", placeholder: "Your job title", type: "text" },
            { label: "Department/Division", placeholder: "Department name", type: "text" },
            { label: "Years of Service", placeholder: "Number of years", type: "number" },
            { label: "Pay Scale/Grade", placeholder: "e.g. Level 7, PB-3", type: "text" },
        ]
    },
    { 
        id: "not_employed", 
        icon: UserX, 
        label: ["Not", "Employed"],
        fields: [
            { label: "Current Status", placeholder: "Student, Homemaker, etc.", type: "text" },
            { label: "Source of Income", placeholder: "If any, please specify", type: "text" },
            { label: "Monthly Income", placeholder: "e.g. ₹20,000", type: "text" },
            { label: "Future Employment Plans", placeholder: "Any plans for employment", type: "text" },
        ]
    },
];

export default function YourLoanApplicationForm() {
    const [purpose, setPurpose] = useState("Business Expansion");
    const [employment, setEmployment] = useState("self");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Form data state
    const [formData, setFormData] = useState({
        fullName: "",
        mobile: "",
        email: "",
        aadhaar: "",
        pan: "",
        relativeName: "",
        relativeMobile: "",
        relationship: "",
    });

    const [employmentData, setEmploymentData] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSubmitError(null);
    };

    const handleEmploymentFieldChange = (field, value) => {
        setEmploymentData(prev => ({ ...prev, [field]: value }));
        setSubmitError(null);
    };

    const selectedEmployment = EMPLOYMENT.find(e => e.id === employment);

    // Realistic API call simulation
    const submitApplication = async () => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Validate employment fields
            const allFieldsFilled = selectedEmployment.fields.every(field => {
                return employmentData[field.label] && employmentData[field.label].trim();
            });

            if (!allFieldsFilled) {
                setSubmitError("Please fill all the employment details");
                setIsSubmitting(false);
                return;
            }

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
                employmentDetails: {
                    type: selectedEmployment.label[0] + " " + selectedEmployment.label[1],
                    details: employmentData,
                },
                reference: {
                    name: formData.relativeName,
                    mobile: formData.relativeMobile,
                    relationship: formData.relationship,
                },
                timestamp: new Date().toISOString(),
            };

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
        // Validate required fields
        if (!formData.fullName.trim()) {
            setSubmitError("Please enter your full name");
            return;
        }
        if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, "").length < 10) {
            setSubmitError("Please enter a valid mobile number");
            return;
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            setSubmitError("Please enter a valid email address");
            return;
        }
        if (!formData.aadhaar.trim() || formData.aadhaar.replace(/\D/g, "").length < 12) {
            setSubmitError("Please enter a valid Aadhaar number");
            return;
        }
        if (!formData.pan.trim() || formData.pan.length < 10) {
            setSubmitError("Please enter a valid PAN number");
            return;
        }
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
                        <div className="w-[390px] shrink-0 bg-[#F5F6FA] rounded-[2rem] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                {/* status bar */}

                <div className="max-h-[900px] overflow-y-auto">
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
                            placeholder="Enter your full name"
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
                                placeholder="Enter your mobile number"
                                value={formData.mobile}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                className="flex-1 min-w-0 px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-transparent"
                            />
                        </div>
                        <div className="h-3.5" />

                        <TextField 
                            label="Email ID" 
                            icon={<Mail size={15} />} 
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(val) => handleInputChange('email', val)}
                        />
                        <div className="h-3.5" />
                        <TextField
                            label="Aadhaar Card Number"
                            icon={<CreditCard size={15} />}
                            placeholder="Enter 12-digit Aadhaar number"
                            value={formData.aadhaar}
                            onChange={(val) => handleInputChange('aadhaar', val)}
                        />
                        <div className="h-3.5" />
                        <TextField
                            label="PAN Card Number"
                            icon={<CreditCard size={15} />}
                            placeholder="Enter 10-character PAN number"
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
                                        className={`flex items-start justify-between gap-1 rounded-lg border p-2.5 text-left ${
                                            selected
                                                ? "border-[#2A4BDE] bg-[#EAF0FD]"
                                                : "border-[#E7E9F0] bg-white"
                                        } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <span
                                            className={`text-[10.5px] leading-tight font-semibold ${
                                                selected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"
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

                    {/* employment card with dynamic fields */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
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
                                const selected = employment === e.id;
                                return (
                                    <button
                                        type="button"
                                        key={e.id}
                                        onClick={() => {
                                            setEmployment(e.id);
                                            setEmploymentData({});
                                        }}
                                        disabled={isSubmitting}
                                        className={`flex flex-col rounded-lg border p-2 transition-all ${
                                            selected
                                                ? "border-[#2A4BDE] bg-[#EAF0FD] shadow-sm"
                                                : "border-[#E7E9F0] bg-white hover:border-[#BCC8F0]"
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
                                            className={`text-[9.5px] leading-tight font-semibold text-left ${
                                                selected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"
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

                        {/* Dynamic employment fields */}
                        {selectedEmployment && (
                            <div className="mt-4 pt-4 border-t border-[#E7E9F0]">
                                <p className="text-[12px] font-semibold text-[#0F1B3D] mb-3">
                                    {selectedEmployment.label[0] + " " + selectedEmployment.label[1]} Details
                                </p>
                                <div className="space-y-3.5">
                                    {selectedEmployment.fields.map((field, index) => (
                                        <div key={index}>
                                            <label className="text-[11px] font-medium text-[#0F1B3D] mb-1 block">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                placeholder={field.placeholder}
                                                value={employmentData[field.label] || ""}
                                                onChange={(e) => handleEmploymentFieldChange(field.label, e.target.value)}
                                                disabled={isSubmitting}
                                                className="w-full rounded-xl border border-[#E7E9F0] px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-white disabled:opacity-50 focus:border-[#2A4BDE] focus:ring-1 focus:ring-[#2A4BDE]/20"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                            className="w-full rounded-xl border border-[#E7E9F0] px-3 py-2.5 text-[13px] text-[#0F1B3D] outline-none appearance-none bg-white disabled:opacity-50"
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

function TextField({ label, icon, placeholder, value, onChange }) {
    return (
        <div>
            <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                {label}
            </label>
            <div className="flex items-center gap-2.5 rounded-xl border border-[#E7E9F0] px-3 py-2.5">
                <span className="text-[#8A8F9E] shrink-0">{icon}</span>
                <input
                    placeholder={placeholder}
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