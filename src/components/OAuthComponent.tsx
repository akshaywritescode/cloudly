import Image from "next/image"

export default function OAuthComponent() {
    return (
        <div className="flex justify-between items-center mb-9">
            <div className="w-[3.6rem] h-[3.6rem] p-1 overflow-hidden border rounded-full flex justify-center items-center">
                <Image src={"/facebook.png"} width={100} height={100} unoptimized alt="facebook logo" />
            </div>

            <div className="w-[3.6rem] h-[3.6rem] p-1 overflow-hidden border rounded-full flex justify-center items-center">
                <Image src={"/google.png"} width={40} height={40} unoptimized alt="facebook logo" />
            </div>

            <div className="w-[3.6rem] h-[3.6rem] p-1 overflow-hidden border rounded-full flex justify-center items-center">
                <Image src={"/apple.svg"} width={33} height={33} unoptimized alt="facebook logo" />
            </div>
        </div>
    )
}