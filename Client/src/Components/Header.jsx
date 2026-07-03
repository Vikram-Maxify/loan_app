import React from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function OwnPocketLogo({ size = 34 }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="OwnPocket logo"
        >
            <rect width="40" height="40" rx="11" fill="#2A4BDE" />
            <path
                d="M10 15.5C10 13.567 11.567 12 13.5 12H26.5C28.433 12 30 13.567 30 15.5V25C30 27.2091 28.2091 29 26 29H14C11.7909 29 10 27.2091 10 25V15.5Z"
                fill="#FFFFFF"
                fillOpacity="0.16"
            />
            <path
                d="M10 16C10 13.7909 11.7909 12 14 12H26C28.2091 12 30 13.7909 30 16V16.5H10V16Z"
                fill="#FFFFFF"
                fillOpacity="0.28"
            />
            <path
                d="M11 17.5H29C29.5523 17.5 30 17.9477 30 18.5V25C30 27.2091 28.2091 29 26 29H14C11.7909 29 10 27.2091 10 25V18.5C10 17.9477 10.4477 17.5 11 17.5Z"
                fill="#FFFFFF"
            />
            <circle cx="24.5" cy="22.5" r="3.5" fill="#2A4BDE" />
            <path
                d="M23 20.7H26.1M23 22.3H26.1M23.4 20.7C24.9 20.7 25.5 21.3 25.5 22C25.5 22.7 24.9 23.3 23.4 23.3L26 25.3"
                stroke="#FFFFFF"
                strokeWidth="0.65"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function OwnPocketHeader({ isSubmitting = false }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <div className="flex items-center justify-between px-4 py-6 bg-white border-b border-[#EEF0F5]">
            <button
                type="button"
                aria-label="Go back"
                className="text-[#0F1B3D] shrink-0 active:opacity-60"
                disabled={isSubmitting}
                onClick={handleBack}
            >
                <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2 flex-1 justify-center">
                <OwnPocketLogo size={34} />
                <div>
                    <p className="text-[15px] font-bold text-[#0F1B3D] leading-none">
                        OwnPocket
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
    );
}