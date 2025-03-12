import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";


type TFeatureCard = {
    featureImage: StaticImageData,
    heading: string
    description: string
}

export default function FeatureCard({ featureImage, heading, description }: TFeatureCard) {
    return <Card className="w-[380px] h-[430px] text-sm pt-5 bg-black border border-white/20" >
        <CardContent>
            <div className="bg-gray-100">
            <Image src={featureImage} alt="feature image" width={400} height={400} className="rounded-sm mb-4" />
            </div>
            <h1 className="text-xl text-white mb-3">{heading}</h1>
            <p className="text-white">{description}</p>
        </CardContent>
    </Card>
}