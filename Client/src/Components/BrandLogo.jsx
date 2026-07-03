import { RotateCw } from "lucide-react";

export default function BrandLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#2A4BDE] flex items-center justify-center shrink-0">
                <RotateCw size={17} className="text-white" strokeWidth={2.25} />
            </div>
            <div>
                <p className="text-[17px] font-bold text-[#0F1B3D] leading-none">
                    OwnPocket
                </p>
                <p className="text-[11px] text-[#8A8F9E] mt-1">
                    Smart Loans For Business
                </p>
            </div>
        </div>
    );
}
