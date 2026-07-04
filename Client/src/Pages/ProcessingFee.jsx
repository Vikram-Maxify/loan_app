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
import { useDispatch, useSelector } from "react-redux";
import OwnPocketHeader from "../Components/Header";
import { generateUserDepositUpiQR, resetUserUpiState } from "../redux/slice/userUpiSlice";
import { getAmountSetting } from "../redux/slice/amountSettingSlice";
import { createOrder } from "../redux/slice/orderSlice"; // Import createOrder

const PAYMENT_METHODS = [
    { id: "upi", label: "UPI", icon: QrCode },
    { id: "card", label: "Card", icon: CreditCard },
    { id: "netbanking", label: "Net Banking", icon: Building2 },
    { id: "wallet", label: "Wallet", icon: Wallet },
];

export default function OnPocketProcessingFee() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState("upi");
    const [razorpayError, setRazorpayError] = useState(null);
    const [orderCreated, setOrderCreated] = useState(false); // Track order creation

    // Get amount from Redux store
    const { amount, loading: amountLoading, error: amountError } = useSelector(
        (state) => state.amountSetting
    );

    // Get UPI state from Redux
    const { loading: upiLoading, qrData, success, error: upiError } = useSelector(
        (state) => state.userUpi
    );

    // Get Order state from Redux
    const { loading: orderLoading, success: orderSuccess, order, error: orderError } = useSelector(
        (state) => state.order
    );

    // Calculate GST and total
    const processingFee = amount || 0;
    const gst = Math.round((processingFee * 18) / 100);
    const totalAmount = processingFee + gst;

    const BREAKDOWN = [
        { label: "Processing Fee", value: `₹ ${processingFee}`, emphasis: false },
        { label: "GST (18%)", value: `₹ ${gst}`, emphasis: false },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getAmountSetting());
        dispatch(resetUserUpiState());
        setOrderCreated(false); // Reset order creation flag
    }, [dispatch]);

    // Handle successful QR generation - Create Order first
    useEffect(() => {
        if (success && qrData && !orderCreated) {
            // First create the order
            const orderData = {
                amount: totalAmount,
                paymentMethod: selectedMethod,
                // Add any other required fields
            };
            
            dispatch(createOrder(orderData));
            setOrderCreated(true);
        }
    }, [success, qrData, dispatch, totalAmount, selectedMethod, orderCreated]);

    // Handle order creation success - Then navigate
    useEffect(() => {
        if (orderSuccess && order && qrData) {
            // Order created successfully, now navigate to payment page with both QR and order data
            navigate("/processing-payment", {
                state: {
                    amount: totalAmount,
                    applicationId: localStorage.getItem("applicationId"),
                    paymentMethod: selectedMethod,
                    qrData: qrData,
                    upiDetails: qrData,
                    orderId: order.orderId || order._id,
                    orderData: order,
                }
            });
            setLoading(false);
            // Reset order creation flag for next time
            setOrderCreated(false);
        }
    }, [orderSuccess, order, qrData, navigate, selectedMethod, totalAmount]);

    // Handle UPI errors
    useEffect(() => {
        if (upiError) {
            setError(upiError);
            setLoading(false);
            setOrderCreated(false);
        }
    }, [upiError]);

    // Handle order errors
    useEffect(() => {
        if (orderError) {
            setError(`Order creation failed: ${orderError}`);
            setLoading(false);
            setOrderCreated(false);
        }
    }, [orderError]);

    // Handle amount fetch errors
    useEffect(() => {
        if (amountError) {
            setError("Failed to load payment amount. Please try again.");
        }
    }, [amountError]);

    const handlePayNow = async () => {
        try {
            setLoading(true);
            setError(null);
            setRazorpayError(null);
            setOrderCreated(false);

            if (selectedMethod === "upi") {
                // Generate UPI QR using Redux thunk
                const payload = {
                    amount: totalAmount,
                };
                
                dispatch(generateUserDepositUpiQR(payload));
            } else {
                // For other payment methods, create order first
                const orderData = {
                    amount: totalAmount,
                    paymentMethod: selectedMethod,
                };
                
                const result = await dispatch(createOrder(orderData)).unwrap();
                
                if (result && result.data) {
                    navigate("/processing-payment", {
                        state: {
                            amount: totalAmount,
                            applicationId: localStorage.getItem("applicationId"),
                            paymentMethod: selectedMethod,
                            orderId: result.data.orderId || result.data._id,
                            orderData: result.data,
                        }
                    });
                }
                setLoading(false);
            }

        } catch (err) {
            console.error("Payment processing failed:", err);
            setError("Failed to process payment. Please try again.");
            setLoading(false);
            setOrderCreated(false);
        }
    };

    // Show loading state while fetching amount
    if (amountLoading) {
        return (
            <div className="w-full bg-white flex items-center justify-center">
                <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                    <OwnPocketHeader />
                    <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
                        <Loader2 size={40} className="animate-spin text-[#2A4BDE]" />
                        <p className="text-[#0F1B3D] font-medium">Loading payment details...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white flex items-center justify-center">
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
                <div className="overflow-y-auto">
                    <OwnPocketHeader />

                    {(loading || upiLoading || orderLoading) ? (
                        <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
                            <Loader2 size={40} className="animate-spin text-[#2A4BDE]" />
                            <p className="text-[#0F1B3D] font-medium">
                                {upiLoading ? "Generating UPI QR Code..." : 
                                 orderLoading ? "Creating order..." : 
                                 "Processing your payment..."}
                            </p>
                            <p className="text-[#5B6072] text-sm">
                                {upiLoading ? "Please wait while we create your QR" : 
                                 orderLoading ? "Please wait while we create your order" :
                                 "Please wait while we redirect you"}
                            </p>
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

                            {/* Amount to Pay - Dynamic */}
                            <div className="mx-4 mt-4 bg-gradient-to-br from-[#2A4BDE] to-[#1A3BAE] rounded-2xl p-5 text-white">
                                <p className="text-[13px] opacity-80">Total Amount to Pay</p>
                                <p className="text-[42px] font-extrabold tracking-tight mt-1">
                                    ₹ {totalAmount}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full">
                                        ₹ {processingFee} + ₹ {gst} GST
                                    </span>
                                </div>
                            </div>

                            {/* Breakdown Card - Dynamic */}
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
                                                disabled={loading || upiLoading || orderLoading}
                                                className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-xl border-2 transition-all duration-200 ${
                                                    isSelected
                                                        ? "border-[#2A4BDE] bg-[#EEF4FF]"
                                                        : "border-[#E7E9F0] bg-white hover:border-[#BCC8F0]"
                                                } ${(loading || upiLoading || orderLoading) ? "opacity-50 cursor-not-allowed" : ""}`}
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
                            {(error || razorpayError) && (
                                <div className="mx-4 mt-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                                    <p className="text-[12px] text-red-600 flex items-center gap-2">
                                        <span className="text-red-500">⚠</span>
                                        {error || razorpayError}
                                    </p>
                                </div>
                            )}

                            {/* Pay Now Button */}
                            <div className="px-4 mt-5">
                                <button
                                    type="button"
                                    onClick={handlePayNow}
                                    disabled={loading || upiLoading || orderLoading}
                                    className={`w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[14.5px] flex items-center justify-center gap-2 transition-all ${
                                        (loading || upiLoading || orderLoading)
                                            ? "opacity-70 cursor-not-allowed"
                                            : "hover:bg-[#1A3BAE] active:scale-[0.99]"
                                    }`}
                                >
                                    {(loading || upiLoading || orderLoading) ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            {upiLoading ? "Generating QR..." : 
                                             orderLoading ? "Creating order..." : 
                                             "Processing..."}
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