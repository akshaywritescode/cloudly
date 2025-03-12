"use client";

import { ChevronDown, Earth, Menu, X } from "lucide-react";
import Logo from "./ui/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="p-4 flex items-center justify-between w-full h-[5rem]">
            <div className="flex items-center gap-4">
                <Logo />
                
                {/* Left-side Links (Hidden later than right-side) */}
                <ul className="hidden md:flex gap-7 items-center">
                    <li className="flex gap-1">
                        <Link href="#" className="text-sm font-medium hover:text-blue-600">Products</Link>
                        <ChevronDown className="w-4" />
                    </li>
                    <li className="flex gap-1">
                        <Link href="#" className="text-sm font-medium hover:text-blue-600">Solutions</Link>
                        <ChevronDown className="w-4" />
                    </li>
                    <li>
                        <Link href="#" className="text-sm font-medium hover:text-blue-600">Enterprise</Link>
                    </li>
                    <li>
                        <Link href="#" className="text-sm font-medium hover:text-blue-600">Pricing</Link>
                    </li>
                </ul>
            </div>

            {/* Right-side Links (Hidden first at lg breakpoint) */}
            <div className="hidden lg:flex gap-7 items-center">
                <Link href="#"><Earth className="w-5" /></Link>
                <Link href="#" className="text-sm font-medium hover:text-blue-600">Contact Sales</Link>
                <Link href="#" className="text-sm font-medium hover:text-blue-600">Get app</Link>
                <Link href="#" className="text-sm font-medium hover:text-blue-600">Log in</Link>
                <Link href="#"><Button className="btn-primary">Get started</Button></Link>
            </div>

            {/* Mobile Menu Button (Appears as soon as right-side links are hidden) */}
            <button 
                className="lg:hidden p-2" 
                onClick={() => setIsOpen(!isOpen)} 
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 hover:cursor-pointer" />}
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-lg">
                    <ul className="flex flex-col gap-4 p-4">
                        {/* Right-side Links (These hide first) */}
                        <li>
                            <Link href="#"><Earth className="w-5" /></Link>
                        </li>
                        <li>
                            <Link href="#" className="text-sm font-medium hover:text-blue-600">Contact Sales</Link>
                        </li>
                        <li>
                            <Link href="#" className="text-sm font-medium hover:text-blue-600">Get app</Link>
                        </li>
                        <li>
                            <Link href="#" className="text-sm font-medium hover:text-blue-600">Log in</Link>
                        </li>
                        <li>
                            <Link href="#"><Button className="w-full btn-primary">Get started</Button></Link>
                        </li>

                        <hr />

                        {/* Left-side Links (These hide later) */}
                        <li className="flex justify-between">
                            <Link href="#" className="text-sm font-medium hover:text-blue-600">Products</Link>
                            <ChevronDown className="w-4" />
                        </li>
                        <li className="flex justify-between">
                            <Link href="#" className="text-sm font-medium hover:text-blue-600">Solutions</Link>
                            <ChevronDown className="w-4" />
                        </li>
                        <li>
                            <Link href="#" className="text-sm font-medium hover:text-blue-600">Enterprise</Link>
                        </li>
                        <li>
                            <Link href="#" className="text-sm font-medium hover:text-blue-600">Pricing</Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}
