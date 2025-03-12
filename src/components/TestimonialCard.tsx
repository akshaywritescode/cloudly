import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";

type TTestimonialCard = {
    description: string
    testimonialName: string
    testimonialUserHandle: string
    testimonialAvatar: StaticImageData,
    testimonialAvatarAlt: string
}

export default function TestimonialCard({ description, testimonialAvatar, testimonialAvatarAlt, testimonialName, testimonialUserHandle }: TTestimonialCard) {
    return <Card className="w-[320px] h-[200px] text-sm pt-5 bg-black border border-white/20" >
        <CardContent>
            <p className="text-white">{description}</p>
        </CardContent>
        <CardFooter className="flex items-center gap-3 py-3">
            <div>
                <Image src={testimonialAvatar} alt={testimonialAvatarAlt} height={40} width={40} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">{testimonialName}</span>
                <span className="text-xs font-normal text-gray-600">{testimonialUserHandle}</span>
            </div>
        </CardFooter>
    </Card>
}