import { Earth } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    return <nav className="p-4 border border-black flex items-center justify-between">
        <Logo />
        <div>
            <ul className="flex gap-7 items-center ">
                <li>
                    <Link href={"#"}><Earth className="w-5" /></Link>
                </li>
                <li>
                    <Link href={"#"} className="hover:text-blue-600">Contact Sales</Link>
                </li>
                <li>
                    <Link href={"#"} className="hover:text-blue-600">Get app</Link>
                </li>
                <li>
                    <Link href={"#"} className="hover:text-blue-600">Sign up</Link>
                </li>
                <li>
                    <Link href={"#"} className="hover:text-blue-600">Log in</Link>
                </li>
                <li>
                    <Link href={"#"}><Button className="btn-primary">Get started</Button></Link>
                </li>
            </ul>
        </div>
    </nav>
}