import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    AlertCircle,
    CheckCircle2,
    Copy,
    Loader2,
    Lock,
    QrCode,
    RefreshCw,
    ShieldCheck,
    Smartphone,
    X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
    fetchUserUpiSettings,
    resetUpiVerification,
    resetUserUpiState,
    verifyCustomerUpiId,
} from "../redux/slice/userUpiSlice";
import {
    buildUpiPaymentUrl,
    generateOrderId,
    isValidUpiId,
    openUPIApp,
    UPI_APPS,
} from "../utils/upiUtils";

const PAYMENT_METHODS = [
    { id: "QR", label: "QR Code", icon: QrCode },
    { id: "APPS", label: "UPI Apps", icon: Smartphone },
    { id: "UPI_ID", label: "UPI ID", icon: ShieldCheck },
];

const APP_BUTTONS = ["GOOGLE_PAY", "PHONEPE", "PAYTM", "BHIM", "GENERIC_UPI"];

const formatINR = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

export default function PaymentCheckout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const initialAmount = Number(location.state?.amount || 259);
    const [amount, setAmount] = useState(initialAmount);
    const [orderId, setOrderId] = useState(() => generateOrderId());
    const [paymentMethod, setPaymentMethod] = useState(location.state?.paymentMethod === "upi" ? "QR" : "QR");
    const [selectedApp, setSelectedApp] = useState("GENERIC_UPI");
    const [customerUpiId, setCustomerUpiId] = useState("");
    const [appOpening, setAppOpening] = useState(null);
    const [copied, setCopied] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const {
        settingsLoading,
        settings,
        error,
        verifyLoading,
        verifyStatus,
        verifyMessage,
    } = useSelector((state) => state.userUpi);

    const adminUpiId = settings?.upiId?.trim() || "";
    const merchantName = settings?.upiName?.trim() || "OwnPocket Pvt Ltd";
    const amountIsValid = Number(amount) > 0;
    const hasOrderId = Boolean(orderId);
    const hasAdminUpi = Boolean(adminUpiId);
    const customerUpiLooksValid = isValidUpiId(customerUpiId);
    const customerUpiVerified = verifyStatus === "verified";
    const selectedMethodIsValid = ["QR", "APPS", "UPI_ID"].includes(paymentMethod);
    const customerVerificationRequired = paymentMethod === "UPI_ID";

    const upiPaymentUrl = useMemo(() => {
        if (!amountIsValid || !hasAdminUpi || !hasOrderId) return "";

        return buildUpiPaymentUrl({
            upiId: adminUpiId,
            merchantName,
            amount,
            orderId,
        });
    }, [adminUpiId, amount, amountIsValid, hasAdminUpi, hasOrderId, merchantName, orderId]);

    const validationError = useMemo(() => {
        if (!amountIsValid) return "Enter a valid amount greater than zero.";
        if (!hasAdminUpi) return "Admin UPI ID is missing. Please contact support.";
        if (!hasOrderId) return "Order ID could not be generated.";
        if (!selectedMethodIsValid) return "Select a valid payment method.";
        if (customerVerificationRequired && verifyLoading) return "UPI verification is still pending.";
        if (customerVerificationRequired && !customerUpiVerified) return "Verify your UPI ID before paying.";
        return null;
    }, [
        amountIsValid,
        customerUpiVerified,
        customerVerificationRequired,
        hasAdminUpi,
        hasOrderId,
        selectedMethodIsValid,
        verifyLoading,
    ]);

    const payDisabled = Boolean(validationError || appOpening || settingsLoading);

    useEffect(() => {
        dispatch(fetchUserUpiSettings());

        return () => {
            dispatch(resetUserUpiState());
        };
    }, [dispatch]);

    useEffect(() => {
        dispatch(resetUpiVerification());
    }, [customerUpiId, dispatch]);

    const refreshOrderId = () => {
        setOrderId(generateOrderId());
        setSubmitError(null);
    };

    const handleAmountChange = (event) => {
        const nextAmount = event.target.value;
        setAmount(nextAmount);
        setSubmitError(null);
    };

    const handleVerifyUpi = async () => {
        setSubmitError(null);

        if (!customerUpiLooksValid) {
            setSubmitError("Enter a valid UPI ID, for example name@bank.");
            return;
        }

        dispatch(verifyCustomerUpiId(customerUpiId.trim()));
    };

    const copyUpiId = async () => {
        if (!adminUpiId) return;
        await navigator.clipboard.writeText(adminUpiId);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    };

    // Payment method handler for PhonePe and PayTM
    const paymentMethodHandler = (type) => {
        if (type === "phonepe") {
            const payload = {
                contact: {
                    cbnName: "",
                    nickName: "",
                    type: "VPA",
                    vpa: adminUpiId,
                },
                p2pPaymentCheckoutParams: {
                    checkoutType: "DEFAULT",
                    initialAmount: amount * 100,
                    note: "Payment",
                    isByDefaultKnownContact: true,
                    currency: "INR",
                    transactionContext: "collect",
                    showKeyboard: true,
                },
            };

            const encoded = btoa(JSON.stringify(payload));
            window.location.href = `phonepe://native?data=${encoded}&id=p2ppayment`;
        }

        if (type === "paytm") {
            window.location.href = `paytmmp://cash_wallet?pa=${adminUpiId}&pn=null&cu=INR&tn=&am=${amount}.00&featuretype=money_transfer`;
        }
    };

    const initiatePayment = (appKey = selectedApp) => {
        setSubmitError(null);

        if (validationError) {
            setSubmitError(validationError);
            return;
        }

        // Handle PhonePe and PayTM separately
        if (appKey === "PHONEPE") {
            setAppOpening("PhonePe");
            paymentMethodHandler("phonepe");
            window.setTimeout(() => setAppOpening(null), 3000);
            return;
        }

        if (appKey === "PAYTM") {
            setAppOpening("PayTM");
            paymentMethodHandler("paytm");
            window.setTimeout(() => setAppOpening(null), 3000);
            return;
        }

        // For other apps, use the existing openUPIApp function
        const app = UPI_APPS[appKey] || UPI_APPS.GENERIC_UPI;
        setAppOpening(app.name);

        openUPIApp({
            appKey,
            upiId: adminUpiId,
            amount: Number(amount),
            merchantName,
            orderId,
        });

        window.setTimeout(() => setAppOpening(null), 3000);
    };

    const handleDirectAppClick = (appKey) => {
        setSelectedApp(appKey);
        if (!amountIsValid || !hasAdminUpi || !hasOrderId) {
            setSubmitError(validationError || "Payment details are incomplete.");
            return;
        }
        initiatePayment(appKey);
    };

    const activeStatus = settingsLoading ? null : submitError || error || validationError;

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center px-3 py-5">
            <div className="max-w-[480px] w-full bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden">
                <div className="bg-white border-b border-[#EEF0F5] px-4 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-[18px] font-extrabold text-[#0F1B3D]">UPI Payment</p>
                        <p className="text-[11px] text-[#8A8F9E] mt-1">Secure processing fee checkout</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-full border border-[#E7E9F0] flex items-center justify-center text-[#0F1B3D]"
                        aria-label="Close payment"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="bg-[#0F1B3D] text-white rounded-2xl p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[11px] text-white/65">Order ID</p>
                                <p className="text-[12px] font-bold mt-1 break-all">{orderId}</p>
                            </div>
                            <button
                                type="button"
                                onClick={refreshOrderId}
                                className="shrink-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
                                aria-label="Generate new order ID"
                            >
                                <RefreshCw size={15} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                                <p className="text-[11px] text-white/65">Amount</p>
                                <p className="text-[24px] font-extrabold mt-0.5">{formatINR(amount)}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-white/65">Method</p>
                                <p className="text-[13px] font-bold mt-1">
                                    {PAYMENT_METHODS.find((item) => item.id === paymentMethod)?.label}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-[#EEF0F5] rounded-2xl p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-[11px] font-semibold text-[#5B6072]">Amount</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    className="mt-1 w-full rounded-xl border border-[#D6DCEA] px-3 py-2.5 text-[14px] font-bold text-[#0F1B3D] outline-none focus:border-[#2A4BDE]"
                                />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold text-[#5B6072]">Merchant Name</p>
                                <p className="mt-1 min-h-[42px] rounded-xl bg-[#F5F6FA] px-3 py-2.5 text-[13px] font-bold text-[#0F1B3D] flex items-center">
                                    {settingsLoading ? "Loading..." : merchantName}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 rounded-xl bg-[#F5F6FA] px-3 py-2.5 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-[11px] text-[#8A8F9E]">Admin UPI ID</p>
                                <p className="text-[13px] font-bold text-[#0F1B3D] break-all">
                                    {settingsLoading ? "Fetching UPI ID..." : adminUpiId || "Not configured"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={copyUpiId}
                                disabled={!adminUpiId}
                                className="shrink-0 w-9 h-9 rounded-full bg-white border border-[#E7E9F0] flex items-center justify-center disabled:opacity-50"
                                aria-label="Copy UPI ID"
                            >
                                {copied ? <CheckCircle2 size={16} className="text-[#1FA24C]" /> : <Copy size={15} />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border border-[#EEF0F5] rounded-2xl p-2 grid grid-cols-3 gap-2">
                        {PAYMENT_METHODS.map((method) => {
                            const Icon = method.icon;
                            const active = paymentMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => {
                                        setPaymentMethod(method.id);
                                        setSubmitError(null);
                                    }}
                                    className={`h-11 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold border ${
                                        active
                                            ? "border-[#2A4BDE] bg-[#EAF0FD] text-[#2A4BDE]"
                                            : "border-transparent text-[#5B6072]"
                                    }`}
                                >
                                    <Icon size={14} />
                                    {method.label}
                                </button>
                            );
                        })}
                    </div>

                    {paymentMethod === "QR" && (
                        <div className="bg-white border border-[#EEF0F5] rounded-2xl p-4 flex flex-col items-center">
                            <div className="w-[220px] h-[220px] rounded-2xl border border-[#D6DCEA] bg-white p-3 flex items-center justify-center">
                                {upiPaymentUrl ? (
                                    <QRCodeSVG
                                        value={upiPaymentUrl}
                                        size={190}
                                        bgColor="#FFFFFF"
                                        fgColor="#111827"
                                        level="H"
                                        includeMargin={false}
                                    />
                                ) : (
                                    <div className="text-center text-[12px] text-[#B42318] px-4">
                                        QR cannot be generated until payment details are complete.
                                    </div>
                                )}
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2 mt-4 text-[11px]">
                                <div className="rounded-xl bg-[#F5F6FA] p-3">
                                    <p className="text-[#8A8F9E]">Amount</p>
                                    <p className="font-bold text-[#0F1B3D] mt-1">{formatINR(amount)}</p>
                                </div>
                                <div className="rounded-xl bg-[#F5F6FA] p-3">
                                    <p className="text-[#8A8F9E]">UPI ID</p>
                                    <p className="font-bold text-[#0F1B3D] mt-1 break-all">{adminUpiId || "Missing"}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {(paymentMethod === "APPS" || paymentMethod === "QR") && (
                        <div className="bg-white border border-[#EEF0F5] rounded-2xl p-4">
                            <p className="text-[13px] font-extrabold text-[#0F1B3D] mb-3">Pay with UPI App</p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {APP_BUTTONS.map((appKey) => {
                                    const app = UPI_APPS[appKey];
                                    const active = selectedApp === appKey;
                                    return (
                                        <button
                                            key={appKey}
                                            type="button"
                                            onClick={() => handleDirectAppClick(appKey)}
                                            disabled={appOpening !== null || settingsLoading}
                                            className={`min-h-[74px] rounded-xl border px-2 py-2 text-center transition-colors disabled:opacity-60 ${
                                                active
                                                    ? "border-[#2A4BDE] bg-[#EAF0FD]"
                                                    : "border-[#E7E9F0] bg-white hover:border-[#BCC8F0]"
                                            }`}
                                        >
                                            <span
                                                className="mx-auto w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold"
                                                style={{ backgroundColor: app.color }}
                                            >
                                                {appOpening === app.name ? <Loader2 size={14} className="animate-spin" /> : app.short}
                                            </span>
                                            <span className="block text-[10.5px] font-bold text-[#0F1B3D] mt-1.5">
                                                {app.name}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {paymentMethod === "UPI_ID" && (
                        <div className="bg-white border border-[#EEF0F5] rounded-2xl p-4">
                            <p className="text-[13px] font-extrabold text-[#0F1B3D]">Your UPI ID</p>
                            <p className="text-[11px] text-[#8A8F9E] mt-1">Verify your UPI ID before starting payment.</p>
                            <div className="mt-3 flex gap-2">
                                <input
                                    type="text"
                                    value={customerUpiId}
                                    onChange={(event) => setCustomerUpiId(event.target.value)}
                                    placeholder="name@bank"
                                    className="min-w-0 flex-1 rounded-xl border border-[#D6DCEA] px-3 py-2.5 text-[13px] outline-none focus:border-[#2A4BDE]"
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyUpi}
                                    disabled={verifyLoading || !customerUpiLooksValid}
                                    className="shrink-0 rounded-xl bg-[#2A4BDE] px-3 py-2.5 text-[12px] font-bold text-white disabled:opacity-50"
                                >
                                    {verifyLoading ? <Loader2 size={16} className="animate-spin" /> : "Verify"}
                                </button>
                            </div>
                            <div className="mt-3 rounded-xl bg-[#F5F6FA] px-3 py-2 flex items-center gap-2">
                                {verifyStatus === "verified" ? (
                                    <CheckCircle2 size={15} className="text-[#1FA24C]" />
                                ) : (
                                    <AlertCircle size={15} className="text-[#B8790A]" />
                                )}
                                <p className="text-[11px] font-semibold text-[#0F1B3D]">
                                    {verifyMessage || "Verification required"}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeStatus && (
                        <div className="rounded-xl border border-[#FAD1D1] bg-[#FFF5F5] px-3 py-2.5 flex items-start gap-2">
                            <AlertCircle size={15} className="text-[#D92D20] shrink-0 mt-0.5" />
                            <p className="text-[11.5px] font-medium text-[#B42318]">{activeStatus}</p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => initiatePayment(selectedApp)}
                        disabled={payDisabled}
                        className="w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-bold text-[14px] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1A3BAE] transition-colors"
                    >
                        {appOpening ? (
                            <>
                                <Loader2 size={17} className="animate-spin" />
                                Opening {appOpening}...
                            </>
                        ) : (
                            <>
                                <Lock size={15} />
                                Pay Now {formatINR(amount)}
                            </>
                        )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#8A8F9E]">
                        <ShieldCheck size={12} />
                        UPI URL includes Order ID, amount, merchant name, and admin UPI ID.
                    </p>
                </div>
            </div>
        </div>
    );
}