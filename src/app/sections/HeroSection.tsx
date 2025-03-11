import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud } from "lucide-react";

export default function HeroSection(){
    return <section className="flex w-screen h-screen">
        <div className="w-1/2 bg-[#0f0700] pt-9 pl-9">
            <div className="flex items-center gap-1">
                <Cloud className="text-white w-5" />
                <span className="text-white font-semibold">Cloudly</span>
            </div>
            <div className="mt-6 flex flex-col gap-6">
                <h1 className="text-5xl text-white leading-[3.5rem]">Do more than store<br /> with Dropbox</h1>
                <p className="text-white">Bring your entire workflow together on one integrated platform that works with the tools you already use. Edit PDFs, share videos, sign documents and collaborate seamlessly with internal and external stakeholders – all without leaving Dropbox.</p>
                <Button className="btn-primary w-56">Get started now <ArrowRight className="ml-5" /></Button>
            </div>
        </div>
        <div className="w-1/2"></div>
    </section>
}