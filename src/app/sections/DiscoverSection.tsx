import { Button } from "@/components/ui/button";
import { montserrat } from "../fonts";
import { ArrowRight } from "lucide-react";

export default function DiscoverSection() {
    return <section className="py-28 bg-white flex justify-center items-center">
        <div className="py-20 w-[95%] bg-blue-600 rounded-2xl flex flex-col items-center gap-10">
            <div>
                <h4 className={`px-3 m-auto text-white text-2xl tracking-wide text-center font-medium md:text-3xl lg:text-5xl lg:leading-[3.8rem] lg:w-[90%] ${montserrat.className}`}>Discover a better way to work together.</h4>
                <p className="text-center px-5 mt-10 text-white text-sm md:text-base lg:text-base">Bring your entire workflow together on one integrated platform that works with the tools you already use. Edit PDFs, share videos, sign documents and collaborate seamlessly with internal and external stakeholders – all without leaving Cloudly.</p>
            </div>
            <Button className="bg-white text-black py-6 text-base lg:py-8 lg:text-xl hover:bg-white/90 hover:cursor-pointer">Learn About Cloudly <ArrowRight /></Button>
        </div>
    </section>
}