import Link from "next/link";
import { montserrat } from "../fonts";
import { Facebook, Twitter, Youtube } from "lucide-react";
import Logo from "@/components/ui/Logo";

const footerSections = [
    {
        title: "Cloudly", data: {
            "Desktop app": "#",
            "Mobile app": "#",
            "Integration": "#",
            "Features": "#",
            "Solutions": "#",
            "Security": "#",
            "Early Access": "#",
            "Templates": "#",
            "Free tools": "#"
        }
    },
    {
        title: "Products", data: {
            "Plus": "#",
            "Professional": "#",
            "Business": "#",
            "Enterprise": "#",
            "Dash": "#",
            "Reclaim.ai": "#",
            "Cloudly Sign": "#",
            "DocSend": "#",
            "Plans": "#",
            "Product updates": "#"
        }
    },
    {
        title: "Features", data: {
            "Send Large Files": "#",
            "Send Long Videos": "#",
            "Cloud photo storage": "#",
            "Secure file transfer": "#",
            "Password manager": "#",
            "Cloud backup": "#",
            "Edit PDFs": "#",
            "Electronic signatures": "#",
            "Convert to PDFs": "#"
        }
    },
    {
        title: "Support", data: {
            "Help center": "#",
            "Contact us": "#",
            "Privacy & terms": "#",
            "Cookie policy": "#",
            "Cookies & CCPA preferences": "#",
            "AI Principles": "#",
            "Sitemaps": "#",
            "Learning Resources": "#",
            "Convert to PDFs": "#"
        }
    },
    {
        title: "Resources", data: {
            "Blog": "#",
            "Customer stories": "#",
            "Resources library": "#",
            "Developers": "#",
            "Community forums": "#",
            "Reffarls": "#",
            "Reseller partners": "#",
            "Integration partners": "#",
            "Find a partner": "#"
        }
    },
    {
        title: "Company", data: {
            "About us": "#",
            "Modern Slavery Statement": "#",
            "Jobs": "#",
            "Investor Relation": "#",
            "ESG": "#",
            "Plus": "#",
        }
    }
];

function FooterSection({ title, data }: { title: string, data: Record<string, string> }) {
    return (
        <div>
            <h3 className={`${montserrat.className} text-lg font-semibold`}>{title}</h3>
            <ul className="mt-4 flex flex-col gap-2">
                {Object.entries(data).map(([name, link], index) => (
                    <li key={index}>
                        <Link href={link} className="text-sm hover:text-[16px] transition-all">
                            {name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <div className="bg-black py-16 px-6 text-white">
            <div className="mb-10 flex flex-col gap-2">
                <Logo color={"text-white"} />
                <span className="text-xs">&copy; 2025 Cloudly. All rights reserved</span>
            </div>
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-12 justify-between">
                {footerSections.map((section, index) => (
                    <FooterSection
                        key={index}
                        title={section.title}
                        data={section.data as unknown as Record<string, string>}
                    />
                ))}
            </div>

            {/* Social Icons - Centered on Small Screens */}
            <div className="flex justify-center md:justify-start gap-5">
                <Twitter />
                <Facebook />
                <Youtube />
            </div>
        </div>
    );
}
