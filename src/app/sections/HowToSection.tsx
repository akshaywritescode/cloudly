import { Button } from "@/components/ui/button";
import { montserrat } from "../fonts";
import { ArrowRight } from "lucide-react";
import HowToImage1 from "@/app/assets/professionals-ui-1272x424.webp"
import HowToImage2 from "@/app/assets/teams-ui-1272x424.webp"
import Image from "next/image";

export default function HowToSection() {
    return <section className="py-24 px-3 bg-gray-200 text-black flex flex-col items-center">
        <h2 className={`px-3 m-auto text-2xl tracking-wide text-center font-medium md:text-3xl lg:text-4xl lg:leading-[3.8rem] lg:w-[80%] ${montserrat.className}`}>How will you use Cloudly?</h2>
        <div className="flex items-center flex-col  mt-24 gap-7 md:flex-row lg:flex-row ">
            <div className="w-[330px] bg-white rounded-lg overflow-hidden md:w-1/2 lg:w-1/2">
                <div>
                    <Image src={HowToImage1} alt="how to image 1" width={300} height={300} className="w-full " quality={100} unoptimized />
                </div>
                <div className="p-6 flex flex-col gap-7">
                    <h3 className={`${montserrat.className} text-2xl`}>For Work</h3>
                    <p>Work efficiently with teammates and clients, stay in sync on projects and keep company data safe – all in one place.</p>
                    <Button className="btn-primary w-56">Try Cloudly <ArrowRight className="ml-5" /></Button>
                </div>
            </div>
            <div className="w-[330px] bg-white rounded-lg overflow-hidden md:w-1/2 lg:w-1/2">
                <div>
                    <Image src={HowToImage2} alt="how to image 1" width={300} height={300} className="w-full " quality={100} unoptimized />
                </div>

                <div className="p-6 flex flex-col gap-7">
                    <h3 className={`${montserrat.className} text-2xl`}>For personal use</h3>
                    <p>Keep everything that’s important to you shareable and safe in one place. Store files in the cloud, share photos and videos and more.</p>
                    <Button className="btn-primary w-56">Compare Plans <ArrowRight className="ml-5" /></Button>
                </div>
            </div>
        </div>
    </section>
}