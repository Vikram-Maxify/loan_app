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
import { useNavigate } from "react-router-dom";
import OwnPocketHeader from "../Components/Header";
import { useDispatch, useSelector } from "react-redux";
import {
    getAmountSetting,
} from "../redux/slice/amountSettingSlice";
import { createOrder } from "../redux/slice/orderSlice"; // Import the createOrder thunk

const PAYMENT_METHODS = [
    { id: "upi", label: "UPI", icon: QrCode },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallet", label: "Wallet", icon: Wallet },
];

// Make BREAKDOWN dynamic based on amount
const getBreakdown = (totalAmount) => {
    const processingFee = totalAmount - (totalAmount * 18 / 118); // Reverse calculate processing fee (excluding GST)
    const gst = totalAmount * 18 / 118;
    
    return [
        { label: "Processing Fee", value: `₹ ${Math.round(processingFee)}`, emphasis: false },
        { label: "GST (18%)", value: `₹ ${Math.round(gst)}`, emphasis: false },
    ];
};

export default function OnPocketProcessingFee() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState("upi");
    const [razorpayError, setRazorpayError] = useState(null);

    // Get amount from Redux store
    const { amount, loading: amountLoading, success, message, error: amountError } = useSelector(
        (state) => state.amountSetting
    );

    // Get order state from Redux store
    const { 
        loading: orderLoading, 
        error: orderError, 
        orderData 
    } = useSelector((state) => state.order || {});

    // Fetch amount settings on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getAmountSetting());
    }, [dispatch]);

    // Handle amount fetch error
    useEffect(() => {
        if (amountError) {
            toast.error(amountError);
            setError("Failed to load payment amount. Please try again.");
        }
    }, [amountError]);

    // Handle order creation response
    useEffect(() => {
        if (orderData) {
            // Order created successfully, navigate to processing payment
            navigate("/processing-payment", {
                state: {
                    amount: totalAmount,
                    applicationId: localStorage.getItem("applicationId"),
                    paymentMethod: selectedMethod,
                    processingFee: processingFeeAmount,
                    gst: gstAmount,
                    orderId: orderData.orderId, // Pass order ID if needed
                    razorpayKey: orderData.razorpayKey, // Pass Razorpay key if needed
                }
            });
            setLoading(false);
        }
    }, [orderData, navigate, totalAmount, selectedMethod, processingFeeAmount, gstAmount]);

    // Handle order creation error
    useEffect(() => {
        if (orderError) {
            console.error("Order creation failed:", orderError);
            setError(orderError || "Failed to create order. Please try again.");
            setLoading(false);
        }
    }, [orderError]);

    // Calculate total amount and breakdown
    const totalAmount = amount || 259; // Fallback to 259 if not fetched
    const breakdown = getBreakdown(totalAmount);
    const gstAmount = Math.round(totalAmount * 18 / 118);
    const processingFeeAmount = Math.round(totalAmount - gstAmount);

    const handlePayNow = async () => {
        try {
            setLoading(true);
            setError(null);
            setRazorpayError(null);

            // Validate amount is available
            if (!amount) {
                setError("Amount configuration not available. Please try again.");
                setLoading(false);
                return;
            }

            // Get application ID from localStorage
            const applicationId = localStorage.getItem("applicationId");
            if (!applicationId) {
                setError("Application ID not found. Please restart the process.");
                setLoading(false);
                return;
            }

            // Prepare order data
            const orderData = {
                applicationId: applicationId,
                amount: totalAmount,
                paymentMethod: selectedMethod,
                processingFee: processingFeeAmount,
                gst: gstAmount,
                // Add any other required fields
            };

            // Dispatch createOrder action
            const result = await dispatch(createOrder(orderData)).unwrap();
            
            // If we reach here, order was created successfully
            // The useEffect for orderData will handle navigation
            console.log("Order created successfully:", result);

        } catch (err) {
            console.error("Payment processing failed:", err);
            setError(err || "Failed to process payment. Please try again.");
            setLoading(false);
        }
    };

    // Loading state while fetching amount
    if (amountLoading) {
        return (
            <div className="w-full bg-white flex items-center justify-center">
                <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                    <div className="overflow-y-auto">
                        <OwnPocketHeader />
                        <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
                            <Loader2 size={40} className="animate-spin text-[#2A4BDE]" />
                            <p className="text-[#0F1B3D] font-medium">Loading payment details...</p>
                            <p className="text-[#5B6072] text-sm">Please wait while we fetch the amount</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white flex items-center justify-center">
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                <div className="overflow-y-auto">
                    {/* Header */}
                    <OwnPocketHeader />

                    {/* Loading Overlay - Conditional rendering inside return */}
                    {(loading || orderLoading) ? (
                        <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
                            <Loader2 size={40} className="animate-spin text-[#2A4BDE]" />
                            <p className="text-[#0F1B3D] font-medium">
                                {loading ? "Processing your payment..." : "Creating order..."}
                            </p>
                            <p className="text-[#5B6072] text-sm">Please wait while we process your request</p>
                        </div>
                    ) : (
                        <>
                            {/* Title Block */}
                            <div className="px-5 pt-5 pb-1">
                                <p className="text-[19px] font-extrabold text-[#0F1B3D] leading-tight">
                                    Processing Fee Payment
                                </p>
                                <p className="text-[12.5px] text-[#5B6072] mt-1.5 leading-relaxed">
                                    Pay the processing fee to initiate your loan disbursal.
                                </p>
                            </div>

                            {/* Amount to Pay */}
                            <div className="mx-4 mt-4 bg-gradient-to-br from-[#2A4BDE] to-[#1A3BAE] rounded-2xl p-5 text-white">
                                <p className="text-[13px] opacity-80">Total Amount to Pay</p>
                                <p className="text-[42px] font-extrabold tracking-tight mt-1">
                                    ₹ {totalAmount}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full">
                                        ₹ {processingFeeAmount} + ₹ {gstAmount} GST
                                    </span>
                                </div>
                            </div>

                            {/* Breakdown Card */}
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
                                    {breakdown.map((row) => (
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
                                        ₹ {totalAmount}
                                    </span>
                                </div>
                                <p className="text-[10.5px] text-[#8A8F9E] mt-1">
                                    Inclusive of all taxes and charges.
                                </p>
                            </div>

                            {/* Payment Methods */}
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
                                                disabled={loading || amountLoading || orderLoading}
                                                className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border-2 transition-all duration-200 ${
                                                    isSelected
                                                        ? "border-[#2A4BDE] bg-[#EEF4FF]"
                                                        : "border-[#E7E9F0] bg-white hover:border-[#BCC8F0]"
                                                } ${(loading || amountLoading || orderLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
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

                            {/* Regulatory Note */}
                            <div className="mx-4 mt-4 bg-[#EAF0FD] rounded-xl px-3.5 py-3 flex items-start gap-2.5">
                                <Info size={15} className="text-[#2A4BDE] shrink-0 mt-0.5" />
                                <p className="text-[11px] text-[#0F1B3D] leading-snug">
                                    This is a one-time processing fee. The amount will be adjusted
                                    in your final loan disbursement. All charges are as per RBI
                                    guidelines.
                                </p>
                            </div>

                            {/* Error Messages */}
                            {(error || amountError || orderError) && (
                                <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                                    <p className="text-[12px] text-red-600 flex items-center gap-2">
                                        <span className="text-red-500">⚠</span>
                                        {error || amountError || orderError}
                                    </p>
                                </div>
                            )}

                            {/* Pay Now Button */}
                            <div className="px-4 mt-5">
                                <button
                                    type="button"
                                    onClick={handlePayNow}
                                    disabled={loading || amountLoading || orderLoading || !amount}
                                    className={`w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
                                        (loading || amountLoading || orderLoading || !amount)
                                            ? "opacity-70 cursor-not-allowed"
                                            : "hover:bg-[#1A3BAE] active:scale-[0.99]"
                                    }`}
                                >
                                    {(loading || orderLoading) ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            {orderLoading ? "Creating Order..." : "Processing..."}
                                        </>
                                    ) : (
                                        <>
                                            Pay ₹ {totalAmount} Now
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F9E] py-4">
                                <Lock size={11} />
                                Your payment is secure and encrypted.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}