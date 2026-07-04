import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Lock, QrCode, ShieldCheck, X, Loader2, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { generateUserDepositUpiQR, resetUserUpiState } from "../redux/slice/userUpiSlice";
import { openUPIApp, UPI_APPS } from "../utils/upiUtils";

const TABS = ["UPI", "QR Code", "Card", "Netbanking", "Wallet"];

const QUICK_APPS = [
    { 
        label: "Google Pay", 
        short: "GP", 
        color: "#5F259F",
        key: "GOOGLE_PAY",
        icon: "/icons/gpay.png" // Optional
    },
    { 
        label: "PhonePe", 
        short: "PP", 
        color: "#00BAF2",
        key: "PHONEPE",
        icon: "/icons/phonepe.png" // Optional
    },
    { 
        label: "Paytm", 
        short: "PT", 
        color: "#00B9F1",
        key: "PAYTM",
        icon: "/icons/paytm.png" // Optional
    },
];

export default function PaymentCheckout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState("QR Code");
    const [amount, setAmount] = useState(259);
    const [upiId, setUpiId] = useState("");
    const [copied, setCopied] = useState(false);
    const [appOpening, setAppOpening] = useState(null);

    // Redux state
    const { loading, qrData, success, error } = useSelector(
        (state) => state.userUpi
    );

    // Generate UPI QR when component mounts or amount changes
    useEffect(() => {
        if (activeTab === "QR Code" && amount > 0) {
            dispatch(generateUserDepositUpiQR(amount));
        }

        return () => {
            dispatch(resetUserUpiState());
        };
    }, [dispatch, amount, activeTab]);

    // Handle QR generation on tab change
    useEffect(() => {
        if (activeTab === "QR Code") {
            dispatch(generateUserDepositUpiQR(amount));
        }
    }, [activeTab, dispatch, amount]);

    // Generate UPI string from API response or fallback
    const getUPIString = () => {
        if (qrData?.qrCode || qrData?.upiString) {
            return qrData.qrCode || qrData.upiString;
        }

        const upiData = {
            pa: "yourloan@upi",
            pn: "OwnPocket Pvt Ltd",
            am: amount,
            cu: "INR",
            tn: "Loan Processing Fee",
        };
        return `upi://pay?pa=${upiData.pa}&pn=${upiData.pn}&am=${upiData.am}&cu=${upiData.cu}&tn=${encodeURIComponent(upiData.tn)}`;
    };

    // Get UPI ID from API response or fallback
    const getUPIId = () => {
        if (qrData?.upiId) {
            return qrData.upiId;
        }
        return "yourloan@upi";
    };

    // Handle copy UPI ID
    const handleCopyUPI = () => {
        const upiToCopy = getUPIId();
        navigator.clipboard.writeText(upiToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ===================== NEW: Handle UPI App Open =====================
    const handleOpenUPIApp = async (appKey, appLabel) => {
        setAppOpening(appLabel);
        
        const upiIdToUse = getUPIId();
        const amountToUse = amount;

        // Try to open the app
        const opened = openUPIApp(appKey, upiIdToUse, amountToUse);

        if (!opened) {
            // If app couldn't be opened, fallback to copy UPI ID
            alert(`${appLabel} is not installed on your device. Please copy the UPI ID and pay manually.`);
            handleCopyUPI();
        }

        // Reset loading state after 3 seconds
        setTimeout(() => {
            setAppOpening(null);
        }, 3000);
    };

    // ===================== NEW: Handle Pay with Custom UPI =====================
    const handlePayWithUPI = () => {
        if (!upiId.trim()) {
            alert("Please enter a valid UPI ID");
            return;
        }

        // Open default UPI app or system UPI picker
        try {
            const upiString = `upi://pay?pa=${upiId.trim()}&pn=OwnPocket%20Pvt%20Ltd&am=${amount}&cu=INR`;
            window.location.href = upiString;
            
            // Fallback after 3 seconds
            setTimeout(() => {
                // If UPI app didn't open, show UPI ID
                alert(`Pay to: ${upiId.trim()}\nAmount: ₹${amount}`);
            }, 3000);
        } catch (error) {
            console.error("Error paying with UPI:", error);
            alert(`Please pay to: ${upiId.trim()}\nAmount: ₹${amount}`);
        }
    };

    // Handle pay button click
    const handlePay = async () => {
        if (activeTab === "QR Code") {
            await dispatch(generateUserDepositUpiQR(amount));
        } else if (activeTab === "UPI") {
            handlePayWithUPI();
        } else {
            // For other tabs
            try {
                console.log("Processing payment...");
            } catch (error) {
                console.error("Payment failed:", error);
            }
        }
    };

    // Get QR data from API response
    const getQRData = () => {
        if (qrData?.qrData) {
            return qrData.qrData;
        }
        return getUPIString();
    };

    return (
        <div className="min-h-screen w-full bg-[#0D1117] flex items-center justify-center p-5">
            <div className="w-[400px] bg-white rounded-[10px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col">
                {/* Top bar */}
                <div className="bg-gradient-to-br from-[#4D2FC4] to-[#2B1670] px-5 py-[18px] flex items-center justify-between text-white">
                    <div className="flex items-center gap-2.5">
                        <div className="w-[34px] h-[34px] rounded-lg bg-white flex items-center justify-center font-extrabold text-[16px] text-[#4D2FC4]">
                            ₹
                        </div>
                        <div>
                            <p className="text-[15px] font-bold leading-none tracking-wide">
                                SecurePay Checkout
                            </p>
                            <p className="text-[10px] opacity-75 mt-1">
                                Trusted Payment Gateway
                            </p>
                        </div>
                    </div>
                    <X
                        size={20}
                        className="opacity-80 cursor-pointer hover:opacity-100 transition-opacity"
                        onClick={() => navigate(-1)}
                    />
                </div>

                {/* Merchant row */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-[#EEEEEE]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-[38px] h-[38px] rounded-full bg-[#EEF0FF] text-[#4D2FC4] flex items-center justify-center font-bold text-[14px]">
                            OP
                        </div>
                        <div>
                            <p className="text-[13.5px] font-bold text-[#111]">
                                OwnPocket Pvt Ltd
                            </p>
                            <p className="text-[11px] text-[#888] mt-0.5">
                                Order #ORD{Date.now().toString().slice(-8)}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10.5px] text-[#999]">Amount Payable</p>
                        <p className="text-[19px] font-extrabold text-[#111]">
                            ₹{amount.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[#EEEEEE] bg-[#FAFAFA] overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 whitespace-nowrap text-center px-2 py-3 text-[12px] font-semibold border-b-2 transition-colors ${
                                activeTab === tab
                                    ? "text-[#4D2FC4] border-[#4D2FC4] bg-white"
                                    : "text-[#888] border-transparent hover:text-[#4D2FC4]"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-5">
                    {activeTab === "QR Code" ? (
                        <div className="flex flex-col items-center py-2">
                            <p className="text-[12px] font-semibold text-[#333] mb-3">
                                Scan &amp; Pay with any UPI app
                            </p>

                            {/* QR Code with loading state */}
                            <div className="relative w-[200px] h-[200px] rounded-xl border-2 border-[#D9D3F5] bg-white p-2 shadow-md flex items-center justify-center">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 size={40} className="text-[#4D2FC4] animate-spin" />
                                        <span className="text-[11px] text-[#888]">Generating QR...</span>
                                    </div>
                                ) : error ? (
                                    <div className="text-center px-4">
                                        <p className="text-[12px] text-red-500 font-medium">Failed to generate QR</p>
                                        <button
                                            onClick={() => dispatch(generateUserDepositUpiQR(amount))}
                                            className="mt-2 text-[11px] text-[#4D2FC4] font-semibold hover:underline"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                ) : (
                                    <QRCodeSVG
                                        value={getQRData()}
                                        size={180}
                                        bgColor="#FFFFFF"
                                        fgColor="#1A1A1A"
                                        level="H"
                                        includeMargin={false}
                                        className="rounded-lg"
                                    />
                                )}
                                {!loading && !error && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-[40px] h-[40px] rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-[#4D2FC4]">
                                            <span className="text-[10px] font-extrabold text-[#4D2FC4]">₹</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <p className="text-[18px] font-extrabold text-[#111] mt-4">
                                ₹{amount.toFixed(2)}
                            </p>
                            <p className="text-[11px] text-[#999] mt-1 text-center">
                                Open any UPI app &rarr; Scan QR &rarr; Pay instantly
                            </p>

                            {/* ===================== UPDATED QUICK APPS BUTTONS ===================== */}
                            <div className="flex items-center gap-3 mt-4">
                                {QUICK_APPS.map((app) => (
                                    <button
                                        key={app.label}
                                        onClick={() => handleOpenUPIApp(app.key, app.label)}
                                        disabled={appOpening !== null}
                                        className="relative group"
                                    >
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold cursor-pointer hover:scale-110 transition-transform"
                                            style={{ background: app.color }}
                                        >
                                            {appOpening === app.label ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : (
                                                app.short
                                            )}
                                        </div>
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-white bg-black/70 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            Open {app.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* UPI ID below QR */}
                            <div className="mt-4 w-full bg-[#F5F5F5] rounded-lg px-3 py-2 flex items-center justify-between">
                                <span className="text-[11px] text-[#666]">UPI ID</span>
                                <span className="text-[12px] font-semibold text-[#111]">
                                    {getUPIId()}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyUPI}
                                className="mt-2 text-[11px] text-[#4D2FC4] font-semibold hover:underline flex items-center gap-1"
                            >
                                {copied ? (
                                    <>
                                        <span>✓</span> Copied!
                                    </>
                                ) : (
                                    <>
                                        <QrCode size={14} />
                                        Copy UPI ID
                                    </>
                                )}
                            </button>

                            {error && (
                                <div className="mt-3 w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                    <p className="text-[11px] text-red-600 text-center">
                                        {typeof error === 'string' ? error : 'Failed to generate QR code'}
                                    </p>
                                </div>
                            )}

                            {success && !loading && (
                                <div className="mt-2 w-full bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    <p className="text-[11px] text-green-600 text-center flex items-center justify-center gap-1">
                                        <span>✓</span> QR Code generated successfully
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="text-[12px] font-semibold text-[#333] mb-1.5">
                                Enter UPI ID
                            </p>
                            <div className="flex items-center gap-2 border-[1.5px] border-[#E0E0E0] rounded-lg px-3 py-[11px] mb-3.5">
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="Enter your UPI ID"
                                    className="flex-1 outline-none text-[13px] text-[#111] bg-transparent"
                                />
                                <span className="text-[10px] font-bold text-[#0A8A4A] bg-[#E8F8EE] px-2 py-1 rounded">
                                    VERIFIED
                                </span>
                            </div>

                            <p className="text-[12px] font-semibold text-[#333] mb-2.5">
                                Or pay using
                            </p>
                            
                            {/* ===================== UPDATED QUICK APPS BUTTONS ===================== */}
                            <div className="flex gap-2.5 mb-4">
                                {QUICK_APPS.map((app) => (
                                    <button
                                        key={app.label}
                                        onClick={() => handleOpenUPIApp(app.key, app.label)}
                                        disabled={appOpening !== null}
                                        className="flex-1 border border-[#EEEEEE] rounded-lg py-2.5 px-1.5 text-center hover:border-[#4D2FC4] transition-colors relative group"
                                    >
                                        <div
                                            className="w-[26px] h-[26px] rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-[11px] font-extrabold"
                                            style={{ background: app.color }}
                                        >
                                            {appOpening === app.label ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                app.short
                                            )}
                                        </div>
                                        <span className="text-[10.5px] font-semibold text-[#555]">
                                            {app.label}
                                        </span>
                                        <span className="text-[8px] text-[#4D2FC4] opacity-0 group-hover:opacity-100 transition-opacity block mt-0.5">
                                            Open App
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={handlePay}
                        disabled={loading || appOpening !== null}
                        className={`w-full py-[13px] rounded-lg bg-gradient-to-br from-[#4D2FC4] to-[#3A1FA0] text-white text-[14.5px] font-bold flex items-center justify-center gap-2 transition-all ${
                            loading || appOpening !== null ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 hover:scale-[1.01]'
                        }`}
                    >
                        {loading || appOpening !== null ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {appOpening ? `Opening ${appOpening}...` : 'Generating...'}
                            </>
                        ) : (
                            <>
                                <Lock size={14} />
                                Pay ₹{amount.toFixed(2)}
                            </>
                        )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#999] mt-3">
                        <ShieldCheck size={12} />
                        100% Secure Payments &nbsp;|&nbsp; PCI-DSS Compliant
                    </p>
                </div>

                <div className="text-center py-3 text-[10px] text-[#BBB] border-t border-[#F2F2F2]">
                    This is a demo checkout UI created for academic/project purposes only.
                </div>
            </div>
        </div>
    );
}