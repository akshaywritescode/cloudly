import Image from "next/image"

export default function OAuthComponent() {
    return (
        <div className="flex justify-between items-center mb-9">
            <div className="w-[3.2rem] h-[3.2rem] p-1 overflow-hidden border rounded-full flex justify-center items-center">
                <Image src={"/facebook.png"} width={100} height={100} unoptimized alt="facebook logo" />
            </div>

            <div className="w-[3.2rem] h-[3.2rem] overflow-hidden border rounded-full flex justify-center items-center">
                <Image src={"/google.png"} width={30} height={30} unoptimized alt="google logo" />
            </div>

            <div className="w-[3.2rem] h-[3.2rem] p-1 overflow-hidden border rounded-full flex justify-center items-center">
                <Image src={"/apple.svg"} width={25} height={25} unoptimized alt="apple logo" />
            </div>
        </div>
    )
}