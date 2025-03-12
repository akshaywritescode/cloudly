import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroImage from "@/app/assets/hero-image.webp";
import { montserrat } from "../fonts";

export default function HeroSection() {
    return (
        <section className="flex flex-col md:flex-row w-full min-h-[calc(100vh-5rem)]">
            {/* Left Section (Text) */}
            <div className="w-full md:w-1/2 bg-[#0f0700] px-6 md:px-10 flex flex-col justify-center py-10 md:py-0">
                <div className="flex items-center gap-1">
                    <Cloud className="text-white w-5" />
                    <span className="text-white font-semibold">Cloudly</span>
                </div>
                <div className="mt-6 flex flex-col gap-6">
                    <h1 className={`text-3xl md:text-5xl text-white leading-snug md:leading-[3.5rem] ${montserrat.className} font-medium`}>
                        Do more than store<br /> with Cloudly
                    </h1>
                    <p className="text-white text-sm md:text-base">
                        Bring your entire workflow together on one integrated platform that works with the tools you already use. 
                        Edit PDFs, share videos, sign documents and collaborate seamlessly with internal and external stakeholders – all without leaving Cloudly.
                    </p>
                    <Button className="btn-primary w-full md:w-56">
                        Get started now <ArrowRight className="ml-5" />
                    </Button>
                    <Link href={"#"} className="text-white underline underline-offset-2 flex gap-3 font-medium">
                        Already have a Cloudly account? Sign in here <ArrowRight className="w-5" />
                    </Link>
                </div>
            </div>

            {/* Right Section (Image) */}
            <div className="w-full md:w-1/2 relative bg-gradient-to-r from-[#f1f1f1] to-[#e4e4e4] flex justify-center items-end py-10 md:py-0">
                <Image
                    src={HeroImage}
                    width={500} height={500} 
                    alt="Hero Image"
                    quality={100}
                    priority
                    className="w-3/4 md:w-[700px] object-contain right-0 bottom-0"
                    unoptimized
                />
            </div>
        </section>
    );
}
