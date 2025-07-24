import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";


type TFeatureCard = {
    featureImage: StaticImageData,
    heading: string
    description: string
}

export default function FeatureCard({ featureImage, heading, description }: TFeatureCard) {
    return <Card className="w-[380px] h-[430px] text-sm pt-5 bg-black border border-white/20" >
        <CardContent className="flex flex-col justify-between h-[400px] gap-5">
            <div className="bg-gray-50 rounded-lg flex justify-center items-center h-[70%]">
                <Image src={featureImage} alt="feature image" unoptimized className="w-[230] h-[230]" />
            </div>
            <div className="h-[30%]">
                <h1 className="text-xl text-white mb-3">{heading}</h1>
                <p className="text-white">{description}</p>
            </div>
        </CardContent>
    </Card>
}