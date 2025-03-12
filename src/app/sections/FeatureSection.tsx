import FeatureCard from "@/components/FeatureCard";
import { montserrat } from "../fonts";
import featureImage1 from "@/app/assets/hero-image.webp"
import featureImage2 from "@/app/assets/feature2.webp"
import featureImage3 from "@/app/assets/feature3.webp"


const featureData = [{
    featureHeading: "Simple organisation",
    featureDescription: "Keep all your files in one place and organise it just the way you want.",
    featureImage: featureImage1
},
{
    featureHeading: "Anytime access",
    featureDescription: "Get to your files and photos wherever and whenever you need them – on desktop, mobile or web.",
    featureImage: featureImage2
},

{
    featureHeading: "Seamless security",
    featureDescription: "Be sure your content is protected across all your devices with industry-leading encryption, automatic backup and two-factor authentication.",
    featureImage: featureImage3
}
]

export default function FeatureSection() {
    return <section className="w-full py-24 px-3 bg-gray-200 text-black flex flex-col items-center">
        <h2 className={`px-3 m-auto text-2xl tracking-wide text-center font-medium md:text-3xl lg:text-4xl lg:leading-[3.8rem] lg:w-[80%] ${montserrat.className}`}>Keep Everything at your fingertips</h2>
        <div className="flex justify-center gap-10 mt-24 w-[95%] flex-wrap">
            {
                featureData.map((feature, index) => (
                    <FeatureCard heading={feature.featureHeading} description={feature.featureDescription} featureImage={feature.featureImage} key={index} />
                ))
            }
        </div>
    </section>
}