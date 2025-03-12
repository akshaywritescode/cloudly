"use client";

import { motion } from "framer-motion";
import avatar1 from "@/app/assets/avatar-1.png";
import avatar2 from "@/app/assets/avatar-2.png";
import avatar3 from "@/app/assets/avatar-3.png";
import avatar4 from "@/app/assets/avatar-4.png";
import avatar5 from "@/app/assets/avatar-5.png";
import avatar6 from "@/app/assets/avatar-6.png";
import avatar7 from "@/app/assets/avatar-7.png";
import avatar8 from "@/app/assets/avatar-8.png";
import avatar9 from "@/app/assets/avatar-9.png";
import TestimonialCard from "@/components/TestimonialCard";
import { montserrat } from "../fonts";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TestimonialSection() {
    const testimonialData = [
        { description: "Rangoli UI is a game-changer! The prebuilt components saved me hours of development time while maintaining top-notch design quality.", testimonialAvatar: avatar1, testimonialName: "Alex Carter", testimonialUserHandle: "@alexdev" },
        { description: "I was looking for a UI library that blends aesthetics with performance, and Rangoli UI exceeded my expectations. Highly recommended!", testimonialAvatar: avatar2, testimonialName: "Samantha Lee", testimonialUserHandle: "@samanthadesign" },
        { description: "As a frontend developer, I love how customizable and lightweight Rangoli UI is. It fits perfectly into my React projects!", testimonialAvatar: avatar3, testimonialName: "Daniel Brown", testimonialUserHandle: "@danbrowncode" },
        { description: "Rangoli UI made my workflow so much smoother. The component designs are beautiful and easy to integrate into any project.", testimonialAvatar: avatar4, testimonialName: "Nina Patel", testimonialUserHandle: "@ninapatelux" },
        { description: "I've used many UI libraries before, but Rangoli UI stands out with its flexibility and performance. A must-have for modern developers!", testimonialAvatar: avatar5, testimonialName: "Liam Johnson", testimonialUserHandle: "@liam_js" },
        { description: "Building UIs has never been this seamless! Rangoli UI strikes the perfect balance between simplicity and design excellence.", testimonialAvatar: avatar6, testimonialName: "Emma Wilson", testimonialUserHandle: "@emmawilsonui" },
        { description: "With Rangoli UI, I no longer worry about inconsistent designs. Everything is polished and works right out of the box.", testimonialAvatar: avatar7, testimonialName: "Chris Adams", testimonialUserHandle: "@chrisux" },
        { description: "Rangoli UI is an absolute delight! The component variety and modern styling make it my go-to library for every project.", testimonialAvatar: avatar8, testimonialName: "Sophia Martinez", testimonialUserHandle: "@sophiamdesign" },
        { description: "I switched to Rangoli UI from another UI kit, and I'm never looking back. The developer experience is unmatched!", testimonialAvatar: avatar9, testimonialName: "Ethan Reynolds", testimonialUserHandle: "@ethanreact" }
    ];

    const column1 = [...testimonialData, ...testimonialData, ...testimonialData].sort(() => Math.random() - 0.5);
    const column2 = [...testimonialData, ...testimonialData, ...testimonialData].sort(() => Math.random() - 0.5);
    const column3 = [...testimonialData, ...testimonialData, ...testimonialData].sort(() => Math.random() - 0.5);

    return (
        <section className="bg-black py-28 px-3 overflow-hidden">
            <h1 className={`px-3 text-2xl tracking-wide text-center text-white m-auto font-medium md:text-3xl lg:text-4xl lg:leading-[3.8rem] lg:w-[80%] ${montserrat.className}`}>
                What users are saying
            </h1>
            <p className="mt-3 text-center font-regular text-white text-sm mb-16">
                Real users. Real stories. Discover how Cloudly is transforming the way people store and access their files.
            </p>
            
            <div className="flex justify-center">
                <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 h-[600px] place-items-center relative">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>

                    <VerticalCarousel items={column1} direction="up" speed={15} />
                    <VerticalCarousel items={column2} direction="down" speed={20} />

                    {/* Only show the third column on large screens */}
                    <div className="hidden lg:block">
                        <VerticalCarousel items={column3} direction="up" speed={12} />
                    </div>
                </div>
            </div>

            <div className="mt-24 flex flex-col items-center gap-7">
                <h2 className={`px-3 text-2xl tracking-wide text-center text-white m-auto font-medium md:text-3xl lg:text-4xl lg:leading-[3.8rem] lg:w-[80%] ${montserrat.className}`}>Trusted by over 700 million registered users and 575,000 teams</h2>
                <Link href={"#"} className="text-white underline underline-offset-2 flex gap-3 font-medium">View customer stories <ArrowRight className="w-5" /></Link>
            </div>
        </section>
    );
}

function VerticalCarousel({ items, direction, speed }) {
    const totalHeight = items.length * 400;
    
    return (
        <div className="relative w-80 overflow-hidden">
            <motion.div
                animate={{
                    y: direction === "up" ? [-totalHeight/2, 0] : [0, -totalHeight/2]
                }}
                transition={{
                    y: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: items.length * (100 / speed),
                        ease: "linear"
                    }
                }}
                className="flex flex-col gap-6"
            >
                {items.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0" >
                        <TestimonialCard
                            description={testimonial.description}
                            testimonialAvatar={testimonial.testimonialAvatar}
                            testimonialAvatarAlt={`Avatar ${index}`}
                            testimonialName={testimonial.testimonialName}
                            testimonialUserHandle={testimonial.testimonialUserHandle}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
}