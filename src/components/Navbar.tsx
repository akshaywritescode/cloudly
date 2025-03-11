import { ChevronDown, Earth } from "lucide-react";
import Logo from "./ui/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return <nav className="p-4 flex items-center justify-between w-full h-[5rem]">
        <div className="flex gap-10">
            <Logo />
            <ul className="flex gap-7 items-center ">
                <li className="flex gap-1">
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Products</Link>
                    <ChevronDown className="w-4" />
                </li>
                <li className="flex gap-1">
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Solutions</Link>
                    <ChevronDown className="w-4" />
                </li>
                <li>
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Enterprise</Link>
                </li>
                <li>
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Pricing</Link>
                </li>
            </ul>
        </div>
        <div>
            <ul className="flex gap-7 items-center ">
                <li>
                    <Link href={"#"}><Earth className="w-5" /></Link>
                </li>
                <li>
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Contact Sales</Link>
                </li>
                <li>
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Get app</Link>
                </li>
                <li>
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Sign up</Link>
                </li>
                <li>
                    <Link href={"#"} className="text-sm font-medium hover:text-blue-600">Log in</Link>
                </li>
                <li>
                    <Link href={"#"}><Button className="btn-primary">Get started</Button></Link>
                </li>
            </ul>
        </div>
    </nav>
}