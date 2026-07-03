import React, { useState, useEffect } from "react";
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
    RotateCw,
    Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createApplication, setApplicationFormDraft } from "../redux/slice/applicationSlice";
import {
    onlyDigits,
    onlyLetters,
    trimSpaces,
    uppercaseAlnum,
    validateAadhaar,
    validateEmail,
    validateIncome,
    validateName,
    validatePAN,
    validatePhone,
} from "../utils/validation";
import OwnPocketHeader from "../Components/Header";

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
        controllerKey: "selfEmployed",
        fields: [
            { key: "businessType", label: "Type of Business/Profession", placeholder: "e.g. Retail, Consultancy, etc.", type: "text" },
            { key: "businessName", label: "Business/Profession Name", placeholder: "Enter your business name", type: "text" },
            { key: "yearsInBusiness", label: "Years in Business", placeholder: "Number of years", type: "number" },
            { key: "annualTurnover", label: "Annual Turnover", placeholder: "e.g. ₹10,00,000", type: "text" },
        ]
    },
    {
        id: "private",
        icon: Building2,
        label: ["Employed", "(Private)"],
        controllerKey: "privateEmployee",
        fields: [
            { key: "companyName", label: "Company Name", placeholder: "Enter your company name", type: "text" },
            { key: "designation", label: "Designation/Role", placeholder: "Your job title", type: "text" },
            { key: "department", label: "Department", placeholder: "e.g. IT, Sales, Finance", type: "text" },
            { key: "yearsOfExperience", label: "Years of Experience", placeholder: "Number of years", type: "number" },
            { key: "monthlySalary", label: "Monthly Salary", placeholder: "e.g. ₹50,000", type: "text" },
        ]
    },
    {
        id: "government",
        icon: Landmark,
        label: ["Government", "Employed"],
        controllerKey: "governmentEmployee",
        fields: [
            { key: "organizationName", label: "Organization Name", placeholder: "Government organization name", type: "text" },
            { key: "designation", label: "Designation/Role", placeholder: "Your job title", type: "text" },
            { key: "department", label: "Department/Division", placeholder: "Department name", type: "text" },
            { key: "yearsOfService", label: "Years of Service", placeholder: "Number of years", type: "number" },
            { key: "payScale", label: "Pay Scale/Grade", placeholder: "e.g. Level 7, PB-3", type: "text" },
        ]
    },
    {
        id: "not_employed",
        icon: UserX,
        label: ["Not", "Employed"],
        controllerKey: "notEmployed",
        fields: [
            { key: "currentStatus", label: "Current Status", placeholder: "Student, Homemaker, etc.", type: "text" },
            { key: "sourceOfIncome", label: "Source of Income", placeholder: "If any, please specify", type: "text" },
            { key: "monthlyIncome", label: "Monthly Income", placeholder: "e.g. ₹20,000", type: "text" },
            { key: "futureEmploymentPlans", label: "Future Employment Plans", placeholder: "Any plans for employment", type: "text" },
        ]
    },
];

export default function OwnPocketApplicationForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, formDraft } = useSelector((state) => state.application);
    const [purpose, setPurpose] = useState(formDraft?.purpose || "Business Expansion");
    const [employment, setEmployment] = useState(formDraft?.employment || "self");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Form data state - Controller ke hisaab se field names
    const [formData, setFormData] = useState(formDraft?.formData || {
        fullName: "",
        mobileNumber: "",
        email: "",
        aadhaarNumber: "",
        panNumber: "",
        relativesReferenceContact: {
            relationship: "",
            relativesName: "",
            mobileNumber: "",
        },
    });

    const [employmentData, setEmploymentData] = useState(formDraft?.employmentData || {});

    // Load draft data
    useEffect(() => {
        if (formDraft) {
            setPurpose(formDraft.purpose || "Business Expansion");
            setEmployment(formDraft.employment || "self");
            setFormData(formDraft.formData || {
                fullName: "",
                mobileNumber: "",
                email: "",
                aadhaarNumber: "",
                panNumber: "",
                relativesReferenceContact: {
                    relationship: "",
                    relativesName: "",
                    mobileNumber: "",
                },
            });
            setEmploymentData(formDraft.employmentData || {});
        }
    }, [formDraft]);

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                };
            }
            return { ...prev, [field]: value };
        });
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        setSubmitError(null);
    };

    const handleEmploymentFieldChange = (key, value) => {
        setEmploymentData(prev => ({ ...prev, [key]: value }));
        setFieldErrors((prev) => ({ ...prev, [key]: "" }));
        setSubmitError(null);
    };

    const selectedEmployment = EMPLOYMENT.find(e => e.id === employment);

    // Submit application
    const submitApplication = async () => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Validate fields
            const nextErrors = {
                fullName: validateName(formData.fullName, "Full name"),
                mobileNumber: validatePhone(formData.mobileNumber),
                email: validateEmail(formData.email),
                aadhaarNumber: validateAadhaar(formData.aadhaarNumber),
                panNumber: validatePAN(formData.panNumber),
                'relativesReferenceContact.relativesName': validateName(
                    formData.relativesReferenceContact?.relativesName,
                    "Relative name"
                ),
                'relativesReferenceContact.mobileNumber': validatePhone(
                    formData.relativesReferenceContact?.mobileNumber,
                    "Relative mobile number"
                ),
                'relativesReferenceContact.relationship': formData.relativesReferenceContact?.relationship
                    ? ""
                    : "Please select relationship with relative",
            };

            // Validate employment fields based on selected type
            selectedEmployment.fields.forEach((field) => {
                const value = employmentData[field.key] || "";
                if (!String(value).trim()) {
                    nextErrors[field.key] = `${field.label} is required`;
                } else if (/income|salary|turnover|revenue|earnings/i.test(field.label)) {
                    const validation = validateIncome(value);
                    if (validation) nextErrors[field.key] = validation;
                } else if (/years/i.test(field.label) && Number(value) < 0) {
                    nextErrors[field.key] = `${field.label} cannot be negative`;
                } else {
                    nextErrors[field.key] = "";
                }
            });

            const firstError = Object.values(nextErrors).find(Boolean);
            setFieldErrors(nextErrors);
            if (firstError) {
                setSubmitError(firstError);
                setIsSubmitting(false);
                return;
            }

            // Build employment details as per controller expectation
            const employmentDetails = {
                [selectedEmployment.controllerKey]: employmentData
            };

            // Prepare payload according to controller
            const payload = {
                fullName: formData.fullName.trim(),
                mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
                email: formData.email.trim(),
                aadhaarNumber: formData.aadhaarNumber.replace(/\D/g, ""),
                panNumber: formData.panNumber.trim().toUpperCase(),
                purpose: "Business Loan",
                forPurposeOfLoan: purpose,
                relativesReferenceContact: {
                    relationship: formData.relativesReferenceContact?.relationship || "",
                    relativesName: formData.relativesReferenceContact?.relativesName?.trim() || "",
                    mobileNumber: formData.relativesReferenceContact?.mobileNumber?.replace(/\D/g, "") || "",
                },
                whatDoYouDo: selectedEmployment.label[0] + " " + selectedEmployment.label[1],
                employmentDetails,
            };

            // Save draft to Redux
            dispatch(
                setApplicationFormDraft({
                    formData: {
                        fullName: trimSpaces(formData.fullName),
                        mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
                        email: formData.email.trim().toLowerCase(),
                        aadhaarNumber: formData.aadhaarNumber.replace(/\D/g, ""),
                        panNumber: formData.panNumber.trim().toUpperCase(),
                        relativesReferenceContact: {
                            relationship: formData.relativesReferenceContact?.relationship || "",
                            relativesName: trimSpaces(formData.relativesReferenceContact?.relativesName || ""),
                            mobileNumber: formData.relativesReferenceContact?.mobileNumber?.replace(/\D/g, "") || "",
                        },
                    },
                    purpose,
                    employment,
                    employmentData,
                })
            );

            const response = await dispatch(createApplication(payload)).unwrap();
            const application = response.data;

            localStorage.setItem("application", JSON.stringify(application));
            localStorage.setItem("applicationId", application._id);
            navigate("/cibilcheck");
        } catch (error) {
            setSubmitError(error || "Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContinue = () => {
        submitApplication();
    };

    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);


    return (
        <div className=" w-full bg-white flex items-center justify-center">
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                <div className="  overflow-y-auto">
                    {/* header */}
                    <OwnPocketHeader />

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
                            onChange={(val) => handleInputChange('fullName', onlyLetters(val).slice(0, 60))}
                            error={fieldErrors.fullName}
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
                                value={formData.mobileNumber}
                                onChange={(e) => handleInputChange('mobileNumber', onlyDigits(e.target.value, 10))}
                                maxLength={10}
                                inputMode="numeric"
                                className={`flex-1 min-w-0 px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-transparent ${fieldErrors.mobileNumber ? "border-red-300" : ""}`}
                            />
                        </div>
                        {fieldErrors.mobileNumber && <p className="text-[10.5px] text-red-600 mt-1">{fieldErrors.mobileNumber}</p>}
                        <div className="h-3.5" />

                        <TextField
                            label="Email ID"
                            icon={<Mail size={15} />}
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(val) => handleInputChange('email', val.trim())}
                            error={fieldErrors.email}
                        />
                        <div className="h-3.5" />
                        <TextField
                            label="Aadhaar Card Number"
                            icon={<CreditCard size={15} />}
                            placeholder="Enter 12-digit Aadhaar number"
                            value={formData.aadhaarNumber}
                            onChange={(val) => handleInputChange('aadhaarNumber', onlyDigits(val, 12))}
                            inputMode="numeric"
                            maxLength={12}
                            error={fieldErrors.aadhaarNumber}
                        />
                        <div className="h-3.5" />
                        <TextField
                            label="PAN Card Number"
                            icon={<CreditCard size={15} />}
                            placeholder="Enter 10-character PAN number"
                            value={formData.panNumber}
                            onChange={(val) => handleInputChange('panNumber', uppercaseAlnum(val, 10))}
                            maxLength={10}
                            error={fieldErrors.panNumber}
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
                                        className={`flex flex-col rounded-lg border p-2 transition-all ${selected
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
                                                value={employmentData[field.key] || ""}
                                                onChange={(e) => {
                                                    const value = /income|salary|turnover|revenue|earnings|years/i.test(field.label)
                                                        ? onlyDigits(e.target.value, 10)
                                                        : e.target.value;
                                                    handleEmploymentFieldChange(field.key, value);
                                                }}
                                                disabled={isSubmitting}
                                                inputMode={/income|salary|turnover|revenue|earnings|years/i.test(field.label) ? "numeric" : undefined}
                                                className={`w-full rounded-xl border px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-white disabled:opacity-50 focus:border-[#2A4BDE] focus:ring-1 focus:ring-[#2A4BDE]/20 ${fieldErrors[field.key] ? "border-red-300" : "border-[#E7E9F0]"}`}
                                            />
                                            {fieldErrors[field.key] && (
                                                <p className="text-[10.5px] text-red-600 mt-1">{fieldErrors[field.key]}</p>
                                            )}
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
                            value={formData.relativesReferenceContact?.relationship || ""}
                            onChange={(e) => handleInputChange('relativesReferenceContact.relationship', e.target.value)}
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
                        {fieldErrors['relativesReferenceContact.relationship'] && (
                            <p className="text-[10.5px] text-red-600 mt-1">
                                {fieldErrors['relativesReferenceContact.relationship']}
                            </p>
                        )}
                        <div className="h-3.5" />

                        <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                            Relative's Name
                        </label>
                        <input
                            placeholder="Enter full name"
                            value={formData.relativesReferenceContact?.relativesName || ""}
                            onChange={(e) => handleInputChange('relativesReferenceContact.relativesName', onlyLetters(e.target.value).slice(0, 60))}
                            disabled={isSubmitting}
                            className={`w-full rounded-xl border px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-white disabled:opacity-50 ${fieldErrors['relativesReferenceContact.relativesName'] ? "border-red-300" : "border-[#E7E9F0]"}`}
                        />
                        {fieldErrors['relativesReferenceContact.relativesName'] && (
                            <p className="text-[10.5px] text-red-600 mt-1">
                                {fieldErrors['relativesReferenceContact.relativesName']}
                            </p>
                        )}
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
                                value={formData.relativesReferenceContact?.mobileNumber || ""}
                                onChange={(e) => handleInputChange('relativesReferenceContact.mobileNumber', onlyDigits(e.target.value, 10))}
                                disabled={isSubmitting}
                                maxLength={10}
                                inputMode="numeric"
                                className="flex-1 min-w-0 px-3 py-2.5 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] outline-none bg-transparent disabled:opacity-50"
                            />
                        </div>
                        {fieldErrors['relativesReferenceContact.mobileNumber'] && (
                            <p className="text-[10.5px] text-red-600 mt-1">
                                {fieldErrors['relativesReferenceContact.mobileNumber']}
                            </p>
                        )}
                    </div>

                    {/* Error message */}
                    {(submitError || error) && (
                        <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                            <p className="text-[12px] text-red-600 flex items-center gap-2">
                                <span className="text-red-500">⚠</span>
                                {typeof (submitError || error) === "string"
                                    ? (submitError || error)
                                    : (submitError || error)?.message ||
                                    (submitError || error)?.response?.data?.message ||
                                    "Something went wrong"}
                            </p>
                        </div>
                    )}

                    {/* continue button */}
                    <div className="px-4 pb-2">
                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={isSubmitting || loading}
                            className={`w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${isSubmitting || loading
                                ? "opacity-70 cursor-not-allowed"
                                : "hover:bg-[#1A3BAE] active:scale-[0.99]"
                                }`}
                        >
                            {isSubmitting || loading ? (
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

function TextField({ label, icon, placeholder, value, onChange, error, inputMode, maxLength }) {
    return (
        <div>
            <label className="text-[11.5px] font-semibold text-[#0F1B3D] mb-1.5 block">
                {label}
            </label>
            <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${error ? "border-red-300" : "border-[#E7E9F0]"}`}>
                <span className="text-[#8A8F9E] shrink-0">{icon}</span>
                <input
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    inputMode={inputMode}
                    maxLength={maxLength}
                    className="flex-1 min-w-0 text-[13px] text-[#0F1B3D] placeholder:text-[#B5B9C4] bg-transparent outline-none"
                />
            </div>
            {error && <p className="text-[10.5px] text-red-600 mt-1">{error}</p>}
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