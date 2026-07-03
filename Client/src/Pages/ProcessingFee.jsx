import React, { useState, useEffect } from "react";
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Info,
    ReceiptText,
    Lock,
    RotateCw,
    Wallet,
    CreditCard,
    Building2,
    QrCode,
    Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPayment, verifyPayment } from "../redux/slice/paymentSlice";

const PAYMENT_METHODS = [
    { id: "upi", label: "UPI", icon: QrCode },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallet", label: "Wallet", icon: Wallet },
];

const BREAKDOWN = [
    { label: "Processing Fee", value: "₹ 200", emphasis: false },
    { label: "GST (18%)", value: "₹ 59", emphasis: false },
];

// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function YourLoanProcessingFee() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, order, payment, paymentStatus } = useSelector((state) => state.payment);
    const [selectedMethod, setSelectedMethod] = useState("upi");
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    const [razorpayError, setRazorpayError] = useState(null);

    // Load Razorpay script on component mount
    useEffect(() => {
        loadRazorpayScript().then((loaded) => {
            setIsRazorpayLoaded(loaded);
            if (!loaded) {
                setRazorpayError("Failed to load payment gateway. Please refresh and try again.");
            }
        });
    }, []);

    // Handle payment response from Razorpay
    const handleRazorpayResponse = async (response) => {
        try {
            // Verify payment with backend
            const verifyResult = await dispatch(verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            })).unwrap();

            if (verifyResult.success) {
                // Payment successful
                localStorage.setItem('paymentId', verifyResult.payment._id);
                localStorage.setItem('paymentStatus', 'success');
                navigate('/payment-success', {
                    state: {
                        payment: verifyResult.payment,
                        orderId: response.razorpay_order_id,
                        paymentId: response.razorpay_payment_id,
                    }
                });
            }
        } catch (err) {
            console.error("Payment verification failed:", err);
            setRazorpayError(err || "Payment verification failed. Please contact support.");
        }
    };

    // Handle Razorpay payment
    const openRazorpay = (orderData, paymentData) => {
        if (!isRazorpayLoaded) {
            setRazorpayError("Payment gateway is not loaded. Please try again.");
            return;
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'YourLoan',
            description: 'Loan Processing Fee',
            order_id: orderData.id,
            receipt: orderData.receipt,
            prefill: {
                name: '',
                email: '',
                contact: '',
            },
            notes: {
                applicationId: paymentData.applicationId,
                paymentMethod: selectedMethod,
            },
            theme: {
                color: '#2A4BDE',
            },
            handler: handleRazorpayResponse,
            modal: {
                ondismiss: function() {
                    // Payment cancelled by user
                    setRazorpayError("Payment cancelled. Please try again.");
                }
            }
        };

        try {
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Razorpay initialization failed:", err);
            setRazorpayError("Failed to initialize payment. Please try again.");
        }
    };

    const handlePayNow = async () => {
        try {
            setRazorpayError(null);

            // Get application from localStorage
            const loanApplication = JSON.parse(
                localStorage.getItem("loanApplication") || "{}"
            );
            
            // Try to get applicationId from multiple sources
            let applicationId = localStorage.getItem("applicationId");
            
            if (!applicationId && loanApplication._id) {
                applicationId = loanApplication._id;
            }
            
            if (!applicationId && loanApplication.applicationId) {
                applicationId = loanApplication.applicationId;
            }

            if (!applicationId) {
                setRazorpayError("Application ID not found. Please submit your application first.");
                return;
            }

            console.log("Sending applicationId:", applicationId); // Debug log

            // Create payment order
            const result = await dispatch(createPayment({
                applicationId: applicationId,
                amount: 259,
            })).unwrap();

            if (result.success) {
                // Store payment info in localStorage
                localStorage.setItem('currentOrderId', result.order.id);
                localStorage.setItem('paymentAmount', '259');
                
                // Open Razorpay checkout
                openRazorpay(result.order, result.payment);
            }
        } catch (err) {
            console.error("Payment creation failed:", err);
            setRazorpayError(err || "Failed to initiate payment. Please try again.");
        }
    };

    // Check if payment is already completed
    useEffect(() => {
        const paymentStatus = localStorage.getItem('paymentStatus');
        if (paymentStatus === 'success') {
            navigate('/payment-success');
        }
    }, [navigate]);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#E7E4DA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={40} className="animate-spin text-[#2A4BDE]" />
                    <p className="text-[#0F1B3D] font-medium">Creating payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#E7E4DA] flex items-center justify-center py-10 px-4">
            <div className="w-[390px] shrink-0 bg-white rounded-[2.75rem] border-[6px] border-[#0F1B3D] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.35)] overflow-hidden relative">

                <div className="max-h-[900px] overflow-y-auto">
                    {/* header */}
                    <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-[#EEF0F5]">
                        <button 
                            type="button" 
                            aria-label="Go back" 
                            className="text-[#0F1B3D] shrink-0"
                            onClick={() => navigate(-1)}
                            disabled={loading}
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

                    {/* title block */}
                    <div className="px-5 pt-5 pb-1">
                        <p className="text-[19px] font-extrabold text-[#0F1B3D] leading-tight">
                            Processing Fee Payment
                        </p>
                        <p className="text-[12.5px] text-[#5B6072] mt-1.5 leading-relaxed">
                            Pay the processing fee to initiate your loan disbursal.
                        </p>
                    </div>

                    {/* amount to pay */}
                    <div className="mx-4 mt-4 bg-gradient-to-br from-[#2A4BDE] to-[#1A3BAE] rounded-2xl p-5 text-white">
                        <p className="text-[13px] opacity-80">Total Amount to Pay</p>
                        <p className="text-[42px] font-extrabold tracking-tight mt-1">
                            ₹ 259
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full">
                                ₹ 200 + ₹ 59 GST
                            </span>
                        </div>
                    </div>

                    {/* breakdown card */}
                    <div className="mx-4 mt-4 bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#DCE6FB] flex items-center justify-center">
                                <ReceiptText size={16} className="text-[#2A4BDE]" />
                            </div>
                            <p className="text-[15px] font-bold text-[#0F1B3D]">
                                Fee Breakdown
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {BREAKDOWN.map((row) => (
                                <div key={row.label} className="flex items-center justify-between">
                                    <span className="text-[12.5px] text-[#5B6072]">
                                        {row.label}
                                    </span>
                                    <span className="text-[13px] font-semibold text-[#0F1B3D]">
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed border-[#E7E9F0] my-4" />

                        <div className="flex items-center justify-between">
                            <span className="text-[13px] font-bold text-[#0F1B3D]">
                                Total Processing Fee
                            </span>
                            <span className="text-[18px] font-extrabold text-[#2A4BDE]">
                                ₹ 259
                            </span>
                        </div>
                        <p className="text-[10.5px] text-[#8A8F9E] mt-1">
                            Inclusive of all taxes and charges.
                        </p>
                    </div>

                    {/* payment methods */}
                    <div className="mx-4 mt-4">
                        <p className="text-[13px] font-semibold text-[#0F1B3D] mb-3">
                            Select Payment Method
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {PAYMENT_METHODS.map((method) => {
                                const Icon = method.icon;
                                const isSelected = selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedMethod(method.id)}
                                        disabled={loading}
                                        className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border-2 transition-all duration-200 ${
                                            isSelected
                                                ? "border-[#2A4BDE] bg-[#EEF4FF]"
                                                : "border-[#E7E9F0] bg-white hover:border-[#BCC8F0]"
                                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                    >
                                        <Icon
                                            size={16}
                                            className={isSelected ? "text-[#2A4BDE]" : "text-[#5B6072]"}
                                        />
                                        <span
                                            className={`text-[12px] font-medium ${
                                                isSelected ? "text-[#2A4BDE]" : "text-[#0F1B3D]"
                                            }`}
                                        >
                                            {method.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* regulatory note */}
                    <div className="mx-4 mt-4 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-start gap-2.5">
                        <Info size={15} className="text-[#2A4BDE] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#0F1B3D] leading-snug">
                            This is a one-time processing fee. The amount will be adjusted
                            in your final loan disbursement. All charges are as per RBI
                            guidelines.
                        </p>
                    </div>

                    {/* Error messages */}
                    {(error || razorpayError) && (
                        <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                            <p className="text-[12px] text-red-600 flex items-center gap-2">
                                <span className="text-red-500">⚠</span>
                                {error || razorpayError}
                            </p>
                        </div>
                    )}

                    {/* Payment Status */}
                    {paymentStatus && (
                        <div className={`mx-4 mt-2 rounded-xl px-3.5 py-2.5 ${
                            paymentStatus === 'success' 
                                ? 'bg-green-50 border border-green-200 text-green-700'
                                : paymentStatus === 'failed'
                                ? 'bg-red-50 border border-red-200 text-red-700'
                                : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                        }`}>
                            <p className="text-[12px] flex items-center gap-2">
                                Status: {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                            </p>
                        </div>
                    )}

                    {/* pay now button */}
                    <div className="px-4 mt-5">
                        <button
                            type="button"
                            onClick={handlePayNow}
                            disabled={loading || !isRazorpayLoaded}
                            className={`w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
                                loading || !isRazorpayLoaded
                                    ? "opacity-70 cursor-not-allowed"
                                    : "hover:bg-[#1A3BAE] active:scale-[0.99]"
                            }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Payment...
                                </>
                            ) : !isRazorpayLoaded ? (
                                "Loading Payment Gateway..."
                            ) : (
                                <>
                                    Pay ₹ 259 Now
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>

                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F9E] py-4">
                        <Lock size={11} />
                        Your payment is secure and encrypted.
                    </p>
                </div>
            </div>
        </div>
    );
}