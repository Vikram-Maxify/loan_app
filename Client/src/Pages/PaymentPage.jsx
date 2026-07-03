import React, { useState } from "react";
import { Lock, QrCode, ShieldCheck, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";


const TABS = ["UPI", "QR Code", "Card", "Netbanking", "Wallet"];

const QUICK_APPS = [
    { label: "Google Pay", short: "GP", color: "#5F259F" },
    { label: "PhonePe", short: "PP", color: "#00BAF2" },
    { label: "Paytm", short: "PT", color: "#00B9F1" },
];

export default function PaymentCheckout() {
    const [activeTab, setActiveTab] = useState("UPI");
    const amount = 259;
    const navigate = useNavigate();


    // Generate UPI QR Code data
    const generateUPIString = () => {
        // UPI format: upi://pay?pa=merchant@upi&pn=MerchantName&am=259&cu=INR
        const upiData = {
            pa: "yourloan@upi", // Merchant UPI ID
            pn: "YourLoan Pvt Ltd", // Merchant Name
            am: amount, // Amount
            cu: "INR", // Currency
            tn: "Loan Processing Fee", // Transaction Note
        };

        // Convert to UPI deep link
        const upiString = `upi://pay?pa=${upiData.pa}&pn=${upiData.pn}&am=${upiData.am}&cu=${upiData.cu}&tn=${encodeURIComponent(upiData.tn)}`;
        return upiString;
    };

    // Generate mock QR code for demo
    const generateMockQRData = () => {
        // This creates a unique QR code based on amount and timestamp
        return `LOAN-${amount}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
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
                        className="opacity-80 cursor-pointer"
                        onClick={() => navigate(-1)}
                    />                </div>

                {/* Merchant row */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-[#EEEEEE]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-[38px] h-[38px] rounded-full bg-[#EEF0FF] text-[#4D2FC4] flex items-center justify-center font-bold text-[14px]">
                            YL
                        </div>
                        <div>
                            <p className="text-[13.5px] font-bold text-[#111]">
                                OwnPocket Pvt Ltd
                            </p>
                            <p className="text-[11px] text-[#888] mt-0.5">
                                Order #ORD10293847
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
                            className={`flex-1 whitespace-nowrap text-center px-2 py-3 text-[12px] font-semibold border-b-2 transition-colors ${activeTab === tab
                                    ? "text-[#4D2FC4] border-[#4D2FC4] bg-white"
                                    : "text-[#888] border-transparent"
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

                            {/* QR Code with proper styling */}
                            <div className="relative w-[200px] h-[200px] rounded-xl border-2 border-[#D9D3F5] bg-white p-2 shadow-md flex items-center justify-center">
                                <QRCodeSVG
                                    value={generateUPIString()}
                                    size={180}
                                    bgColor="#FFFFFF"
                                    fgColor="#1A1A1A"
                                    level="H"
                                    includeMargin={false}
                                    className="rounded-lg"
                                />
                                {/* Center logo on QR */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-[40px] h-[40px] rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-[#4D2FC4]">
                                        <span className="text-[10px] font-extrabold text-[#4D2FC4]">₹</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[18px] font-extrabold text-[#111] mt-4">
                                ₹{amount.toFixed(2)}
                            </p>
                            <p className="text-[11px] text-[#999] mt-1 text-center">
                                Open any UPI app &rarr; Scan QR &rarr; Pay instantly
                            </p>

                            <div className="flex items-center gap-3 mt-4">
                                {QUICK_APPS.map((app) => (
                                    <div
                                        key={app.label}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold"
                                        style={{ background: app.color }}
                                    >
                                        {app.short}
                                    </div>
                                ))}
                            </div>

                            {/* UPI ID below QR */}
                            <div className="mt-4 w-full bg-[#F5F5F5] rounded-lg px-3 py-2 flex items-center justify-between">
                                <span className="text-[11px] text-[#666]">UPI ID</span>
                                <span className="text-[12px] font-semibold text-[#111]">yourloan@upi</span>
                            </div>

                            {/* Copy UPI ID button */}
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard.writeText("yourloan@upi");
                                    alert("UPI ID copied to clipboard!");
                                }}
                                className="mt-2 text-[11px] text-[#4D2FC4] font-semibold hover:underline"
                            >
                                Copy UPI ID
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="text-[12px] font-semibold text-[#333] mb-1.5">
                                Enter UPI ID
                            </p>
                            <div className="flex items-center gap-2 border-[1.5px] border-[#E0E0E0] rounded-lg px-3 py-[11px] mb-3.5">
                                <input
                                    type="text"
                                    readOnly
                                    value="yourname@okhdfcbank"
                                    className="flex-1 outline-none text-[13px] text-[#111] bg-transparent"
                                />
                                <span className="text-[10px] font-bold text-[#0A8A4A] bg-[#E8F8EE] px-2 py-1 rounded">
                                    VERIFIED
                                </span>
                            </div>

                            <p className="text-[12px] font-semibold text-[#333] mb-2.5">
                                Or pay using
                            </p>
                            <div className="flex gap-2.5 mb-4">
                                {QUICK_APPS.map((app) => (
                                    <div
                                        key={app.label}
                                        className="flex-1 border border-[#EEEEEE] rounded-lg py-2.5 px-1.5 text-center"
                                    >
                                        <div
                                            className="w-[26px] h-[26px] rounded-full mx-auto mb-1.5 flex items-center justify-center text-white text-[11px] font-extrabold"
                                            style={{ background: app.color }}
                                        >
                                            {app.short}
                                        </div>
                                        <span className="text-[10.5px] font-semibold text-[#555]">
                                            {app.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <button
                        type="button"
                        className="w-full py-[13px] rounded-lg bg-gradient-to-br from-[#4D2FC4] to-[#3A1FA0] text-white text-[14.5px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-1"
                    >
                        <Lock size={14} />
                        Pay ₹{amount.toFixed(2)}
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