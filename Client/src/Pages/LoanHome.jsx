import React, { useEffect } from "react";
import {
    Menu,
    Star,
    TrendingUp,
    Zap,
    Percent,
    FileText,
    IndianRupee,
    Store,
    Timer,
    TrendingDown,
    Files,
    Headset,
    Briefcase,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../Components/BrandLogo";
import {OwnPocketLogo} from "../Components/Header";

const FEATURES_TOP = [
    { icon: Zap, label: ["Quick Approval", "in 24 Hours"] },
    { icon: Percent, label: ["Low Interest", "Rates"] },
    { icon: FileText, label: ["Minimal", "Documentation"] },
    { icon: IndianRupee, label: ["Loan up to", "₹25 Lakhs"] },
];

const FEATURES_GRID = [
    {
        icon: Timer,
        title: "Quick Disbursal",
        desc: "Get your loan amount disbursed in your account within 24 hours.",
    },
    {
        icon: TrendingDown,
        title: "Affordable Rates",
        desc: "We offer competitive interest rates to support your growth.",
    },
    {
        icon: Files,
        title: "Easy Documentation",
        desc: "Minimal paperwork and simple process to save your valuable time.",
    },
    {
        icon: Headset,
        title: "Dedicated Support",
        desc: "Our expert support team is always here to help you at every step.",
    },
];

export default function OwnPocketHome() {

    const navigate = useNavigate();

const handleContinue = () => {
        navigate('/home');
};

useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, []);

    return (
        <div className=" w-full bg-white flex items-center justify-center">
            <div className="max-w-[480px] w-full shrink-0 bg-[#F5F6FA] border border-[#E3E5EC] shadow-[0_30px_60px_-15px_rgba(20,32,61,0.2)] overflow-hidden relative">
            
                <div className="  overflow-y-auto">
                    {/* header */}
                   <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
    <div className="flex items-center gap-2">
        <OwnPocketLogo />
        <h1 className="text-xl font-bold text-gray-800">OwnPocket</h1>
    </div>
    {/* <button 
        type="button" 
        aria-label="Open menu"
        className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
        <Menu size={22} className="text-[#2A4BDE]" strokeWidth={2.25} />
    </button> */}
</div>

                    {/* hero */}
                    <div className="bg-[#EEF1FA] px-5 pt-6 pb-8">
                        <div className="inline-flex items-center gap-1.5 bg-[#DCE6FB] text-[#2A4BDE] text-[11px] font-semibold px-3 py-1.5 rounded-full mb-5">
                            <Star size={12} fill="#2A4BDE" strokeWidth={0} />
                            Smart Loans For Smart Businesses
                        </div>

                        <h1 className="text-[34px] font-extrabold text-[#0F1B3D] leading-[1.08] mb-4">
                            Personal Loan
                            <br />
                            For Your
                            <br />
                            <span className="inline-flex items-center gap-2 text-[#2A4BDE]">
                                Business Growth
                                <TrendingUp size={26} className="text-[#2A4BDE]" strokeWidth={2.5} />
                            </span>
                        </h1>

                        <p className="text-[13.5px] text-[#5B6072] leading-relaxed mb-6">
                            Get quick and hassle-free personal loans up to ₹25 Lakhs to
                            grow and expand your small business.
                        </p>

                        <button
                        onClick={handleContinue}
                            type="button"
                            className="w-full h-12 rounded-xl bg-[#2A4BDE] text-white font-semibold text-[15px] flex items-center justify-center gap-2 mb-7"
                        >
                            Apply Now
                            <ArrowRight size={17} />
                        </button>

                        <div className="flex items-start justify-between mb-7">
                            {FEATURES_TOP.map((f, i) => (
                                <React.Fragment key={f.label[0]}>
                                    <div className="flex flex-col items-center text-center w-[76px]">
                                        <div className="w-11 h-11 rounded-full bg-[#DCE6FB] flex items-center justify-center mb-2">
                                            <f.icon size={19} className="text-[#2A4BDE]" strokeWidth={2} />
                                        </div>
                                        <p className="text-[11.5px] font-semibold text-[#0F1B3D] leading-tight">
                                            {f.label[0]}
                                        </p>
                                        <p className="text-[11.5px] text-[#5B6072] leading-tight">
                                            {f.label[1]}
                                        </p>
                                    </div>
                                    {i < FEATURES_TOP.length - 1 && (
                                        <div className="w-px h-10 bg-[#D6DCEA] mt-5" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#DCE6FB] flex items-center justify-center shrink-0">
                                <Store size={26} className="text-[#2A4BDE]" strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="text-[16px] font-extrabold text-[#0F1B3D] leading-[1.2]">
                                    Empowering
                                    <br />
                                    Small Businesses
                                </p>
                                <p className="text-[12.5px] text-[#5B6072] leading-snug mt-1.5">
                                    Fuel your business dreams with fast and reliable loans.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* why choose us */}
                    <div className="bg-white px-5 pt-8 pb-7">
                        <p className="text-center text-[11px] font-bold tracking-wider text-[#2A4BDE] mb-2">
                            WHY CHOOSE US
                        </p>
                        <h2 className="text-center text-[20px] font-extrabold text-[#0F1B3D] leading-tight mb-6">
                            Loans That Understand
                            <br />
                            Your Business Needs
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {FEATURES_GRID.map((f) => (
                                <div
                                    key={f.title}
                                    className="bg-white border border-[#E7E9F0] rounded-xl p-3.5"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#DCE6FB] flex items-center justify-center mb-2.5">
                                        <f.icon size={17} className="text-[#2A4BDE]" strokeWidth={2} />
                                    </div>
                                    <p className="text-[13px] font-bold text-[#0F1B3D] mb-1">
                                        {f.title}
                                    </p>
                                    <p className="text-[11px] text-[#5B6072] leading-snug">
                                        {f.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* bottom CTA banner */}
                    <div className="px-5 pb-6">
                        <div className="bg-[#0F1B3D] rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#2A4BDE] flex items-center justify-center shrink-0">
                                <Briefcase size={16} className="text-white" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-white leading-tight">
                                    Ready to Grow Your Business?
                                </p>
                                <p className="text-[10.5px] text-white/60 leading-snug mt-1">
                                    Apply now and take the first step towards expanding your
                                    business.
                                </p>
                            </div>
                            <button
                            onClick={handleContinue}
                                type="button"
                                className="shrink-0 h-9 px-3.5 rounded-lg bg-white text-[#2A4BDE] font-semibold text-[12px] flex items-center gap-1.5"
                            >
                                Apply Now
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
