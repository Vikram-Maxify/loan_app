import React, { useState, useRef } from "react";
import {
    ArrowLeft,
    Menu,
    Landmark,
    Banknote,
    Fingerprint,
    CreditCard,
    Upload,
    ShieldCheck,
    FileCheck2,
    ArrowRight,
    Lock,
    RotateCw,
    Check,
    X,
    Loader2,
} from "lucide-react";

const NEXT_STEPS = [
    {
        icon: FileCheck2,
        title: "1. Submit KYC",
        desc: "Upload your KYC documents",
    },
    {
        icon: ShieldCheck,
        title: "2. Verification",
        desc: "We will verify your documents",
    },
    {
        icon: Landmark,
        title: "3. Get Amount",
        desc: "Amount will be sent to your bank account",
    },
];

const CONFETTI = [
    { top: "2px", left: "8px", size: 6, color: "#EC4899" },
    { top: "18px", left: "0px", size: 5, color: "#F59E0B" },
    { top: "38px", left: "6px", size: 4, color: "#6366F1" },
    { top: "4px", left: "70px", size: 5, color: "#22C55E" },
    { top: "26px", left: "82px", size: 6, color: "#F59E0B" },
    { top: "48px", left: "76px", size: 4, color: "#EC4899" },
];

export default function YourLoanApproved() {
    const [aadhaarFile, setAadhaarFile] = useState(null);
    const [panFile, setPanFile] = useState(null);
    const [aadhaarPreview, setAadhaarPreview] = useState(null);
    const [panPreview, setPanPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const aadhaarInputRef = useRef(null);
    const panInputRef = useRef(null);

    const handleFileUpload = (type, file) => {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setUploadError('Please upload a valid image file (JPEG, PNG, WEBP)');
            return false;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size should be less than 5MB');
            return false;
        }

        setUploadError(null);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'aadhaar') {
                setAadhaarFile(file);
                setAadhaarPreview(reader.result);
            } else {
                setPanFile(file);
                setPanPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
        
        return true;
    };

    const handleFileChange = (type, event) => {
        const file = event.target.files[0];
        if (file) {
            handleFileUpload(type, file);
        }
    };

    const handleDrop = (type, event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileUpload(type, file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const removeFile = (type) => {
        if (type === 'aadhaar') {
            setAadhaarFile(null);
            setAadhaarPreview(null);
            if (aadhaarInputRef.current) {
                aadhaarInputRef.current.value = '';
            }
        } else {
            setPanFile(null);
            setPanPreview(null);
            if (panInputRef.current) {
                panInputRef.current.value = '';
            }
        }
    };

    const handleSubmit = async () => {
        if (!aadhaarFile || !panFile) {
            setUploadError('Please upload both Aadhaar and PAN card images');
            return;
        }

        try {
            setIsSubmitting(true);
            setUploadError(null);

            // Prepare KYC data
            const kycData = {
                aadhaar: {
                    fileName: aadhaarFile.name,
                    fileSize: aadhaarFile.size,
                    fileType: aadhaarFile.type,
                    // In real implementation, you would upload the file to server
                    // and get back a URL or file ID
                },
                pan: {
                    fileName: panFile.name,
                    fileSize: panFile.size,
                    fileType: panFile.type,
                },
                submittedAt: new Date().toISOString(),
                status: 'pending_verification'
            };

            // Store KYC data
            localStorage.setItem('kycData', JSON.stringify(kycData));
            localStorage.setItem('kycStatus', 'submitted');

            // Simulate API call
            // const formData = new FormData();
            // formData.append('aadhaar', aadhaarFile);
            // formData.append('pan', panFile);
            // 
            // const response = await fetch('/api/kyc/upload', {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': 'Bearer ' + localStorage.getItem('token')
            //     },
            //     body: formData
            // });
            // 
            // if (!response.ok) {
            //     throw new Error('Failed to upload KYC documents');
            // }
            // 
            // const data = await response.json();

            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Navigate to bank details page
            window.location.href = "/bank-detail";
        } catch (error) {
            setUploadError(error.message || 'Failed to upload documents. Please try again.');
            setIsSubmitting(false);
        }
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
                    <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#EEF0F5]">
                        <button type="button" aria-label="Go back" className="text-[#0F1B3D]">
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-[#2A4BDE] flex items-center justify-center shrink-0">
                                <RotateCw size={17} className="text-white" strokeWidth={2.25} />
                            </div>
                            <div>
                                <p className="text-[17px] font-bold text-[#0F1B3D] leading-none">
                                    YourLoan
                                </p>
                                <p className="text-[11px] text-[#8A8F9E] mt-1">
                                    Smart Loans For Business
                                </p>
                            </div>
                        </div>
                        <button type="button" aria-label="Open menu">
                            <Menu size={22} className="text-[#0F1B3D]" strokeWidth={2.25} />
                        </button>
                    </div>

                    {/* approved banner */}
                    <div className="mx-4 mt-4 bg-[#EEF6EF] rounded-2xl p-4 relative overflow-hidden">
                        <div className="relative w-14 h-14 mb-4">
                            {CONFETTI.map((c, i) => (
                                <span
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                        top: c.top,
                                        left: c.left,
                                        width: c.size,
                                        height: c.size,
                                        background: c.color,
                                    }}
                                />
                            ))}
                            <div className="w-12 h-12 rounded-full bg-[#1FA24C] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                                    <path
                                        d="M6 12.5L10 16.5L18 8"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-start justify-between gap-3">
                            <div className="max-w-[180px]">
                                <h1 className="text-[22px] font-extrabold leading-[1.15]">
                                    <span className="text-[#0F1B3D]">Your Loan Has</span>
                                    <br />
                                    <span className="text-[#1FA24C]">Been Approved!</span>
                                </h1>
                                <p className="text-[12.5px] text-[#5B6072] leading-relaxed mt-2.5">
                                    Congratulations! Your loan is approved. Submit your KYC
                                    documents to receive the amount in your bank account.
                                </p>
                            </div>

                            <div className="relative w-[130px] h-[125px] shrink-0 -mt-1">
                                <Landmark
                                    size={92}
                                    className="text-[#B9C1D9] absolute right-0 top-0"
                                    strokeWidth={1.25}
                                />
                                <div className="absolute right-[6px] bottom-[6px] flex items-end">
                                    <Banknote
                                        size={30}
                                        className="text-[#1FA24C]"
                                        strokeWidth={1.5}
                                        fill="#D9F0DE"
                                    />
                                </div>
                                <div className="absolute right-[-4px] bottom-[24px] w-7 h-7 rounded-full bg-[#1FA24C] flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                                        <path
                                            d="M6 12.5L10 16.5L18 8"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 bg-white rounded-xl border border-[#E3EFE6] grid grid-cols-3 divide-x divide-[#EEF0F5] py-3.5">
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Approved Amount</p>
                                <p className="text-[15px] font-extrabold text-[#1FA24C] mt-1">
                                    ₹ 30,000
                                </p>
                            </div>
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Tenure</p>
                                <p className="text-[15px] font-extrabold text-[#0F1B3D] mt-1">
                                    6 Months
                                </p>
                            </div>
                            <div className="flex flex-col items-center px-1">
                                <p className="text-[10.5px] text-[#8A8F9E]">Interest Rate</p>
                                <p className="text-[15px] font-extrabold text-[#0F1B3D] mt-1">
                                    2.5% p.m.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* KYC card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <p className="text-[16px] font-extrabold text-[#0F1B3D] mb-1">
                            Submit Your KYC
                        </p>
                        <p className="text-[12px] text-[#5B6072] mb-4">
                            Complete KYC verification to disburse the loan amount.
                        </p>

                        {/* Aadhaar Upload */}
                        <div className="border border-[#EEF0F5] rounded-xl divide-y divide-[#EEF0F5]">
                            <div className="p-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-lg bg-[#FFF3E4] border border-[#F6E3C8] flex items-center justify-center shrink-0">
                                        <Fingerprint size={20} className="text-[#E8792B]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-[#0F1B3D]">
                                            Aadhaar Card
                                        </p>
                                        <p className="text-[10.5px] text-[#8A8F9E] mt-0.5">
                                            {aadhaarFile ? aadhaarFile.name : 'Upload clear front side image'}
                                        </p>
                                    </div>
                                    {aadhaarPreview ? (
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#EEF0F5]">
                                                <img 
                                                    src={aadhaarPreview} 
                                                    alt="Aadhaar preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('aadhaar')}
                                                className="p-1 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <X size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => aadhaarInputRef.current?.click()}
                                            className="shrink-0 flex items-center gap-1.5 border border-[#D6DCEA] rounded-lg px-3 py-2 text-[#2A4BDE] text-[12px] font-semibold hover:bg-[#EAF0FD] transition-colors"
                                        >
                                            <Upload size={13} />
                                            Upload
                                        </button>
                                    )}
                                </div>
                                <input
                                    ref={aadhaarInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('aadhaar', e)}
                                    className="hidden"
                                />
                            </div>

                            {/* PAN Upload */}
                            <div className="p-3.5">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-lg bg-[#EAF0FD] border border-[#D6E1F9] flex items-center justify-center shrink-0">
                                        <CreditCard size={20} className="text-[#2A4BDE]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-bold text-[#0F1B3D]">
                                            PAN Card
                                        </p>
                                        <p className="text-[10.5px] text-[#8A8F9E] mt-0.5">
                                            {panFile ? panFile.name : 'Upload clear image'}
                                        </p>
                                    </div>
                                    {panPreview ? (
                                        <div className="flex items-center gap-2">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#EEF0F5]">
                                                <img 
                                                    src={panPreview} 
                                                    alt="PAN preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFile('pan')}
                                                className="p-1 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <X size={16} className="text-red-500" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => panInputRef.current?.click()}
                                            className="shrink-0 flex items-center gap-1.5 border border-[#D6DCEA] rounded-lg px-3 py-2 text-[#2A4BDE] text-[12px] font-semibold hover:bg-[#EAF0FD] transition-colors"
                                        >
                                            <Upload size={13} />
                                            Upload
                                        </button>
                                    )}
                                </div>
                                <input
                                    ref={panInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('pan', e)}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Upload status indicators */}
                        <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${aadhaarFile ? 'bg-[#1FA24C]' : 'bg-[#D6DCEA]'}`} />
                                <span className="text-[10.5px] text-[#5B6072]">
                                    Aadhaar {aadhaarFile ? '✓' : 'pending'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-2 h-2 rounded-full ${panFile ? 'bg-[#1FA24C]' : 'bg-[#D6DCEA]'}`} />
                                <span className="text-[10.5px] text-[#5B6072]">
                                    PAN {panFile ? '✓' : 'pending'}
                                </span>
                            </div>
                        </div>

                        {uploadError && (
                            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                                <p className="text-[11.5px] text-red-600 flex items-center gap-2">
                                    <span className="text-red-500">⚠</span>
                                    {uploadError}
                                </p>
                            </div>
                        )}

                        <div className="mt-3.5 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-start gap-2.5">
                            <ShieldCheck size={16} className="text-[#2A4BDE] shrink-0 mt-0.5" />
                            <p className="text-[11.5px] text-[#0F1B3D] leading-snug">
                                Your documents are 100% secure and will be used only for
                                verification purposes.
                            </p>
                        </div>
                    </div>

                    {/* what happens next */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <p className="text-[16px] font-extrabold text-[#0F1B3D] mb-4">
                            What Happens Next?
                        </p>

                        <div className="flex items-start">
                            {NEXT_STEPS.map((step, i) => (
                                <React.Fragment key={step.title}>
                                    <div className="flex flex-col items-center text-center w-[92px]">
                                        <div className="w-12 h-12 rounded-full bg-[#EAF6EC] flex items-center justify-center mb-2">
                                            <step.icon size={20} className="text-[#1FA24C]" strokeWidth={2} />
                                        </div>
                                        <p className="text-[11px] font-bold text-[#0F1B3D] leading-tight">
                                            {step.title}
                                        </p>
                                        <p className="text-[10px] text-[#8A8F9E] leading-tight mt-1">
                                            {step.desc}
                                        </p>
                                    </div>
                                    {i < NEXT_STEPS.length - 1 && (
                                        <div className="flex-1 flex items-center justify-center mt-6">
                                            <div className="w-full border-t border-dashed border-[#D6DCEA]" />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* submit button */}
                    <div className="px-4 mt-5">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`w-full h-12 rounded-xl font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
                                isSubmitting
                                    ? "bg-[#2A4BDE] text-white opacity-70 cursor-not-allowed"
                                    : "bg-[#2A4BDE] text-white hover:bg-[#1A3BAE] active:scale-[0.99]"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Submitting KYC...
                                </>
                            ) : (
                                <>
                                    Submit KYC Now
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