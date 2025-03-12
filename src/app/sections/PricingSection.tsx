"use client"

import PricingCard from "@/components/PricingCard"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react"
import { montserrat } from "../fonts";


export default function PricingSection() {
    const [isMonthly, setIsMonthly] = useState(false)


    return <section className="my-28 px-4 flex flex-col items-center ">
        <div className="flex flex-col items-center">
            <h2 className={`px-3 text-2xl tracking-wide text-center font-medium md:text-3xl lg:text-4xl lg:leading-[3.8rem] lg:w-[80%] ${montserrat.className}`}>Choose one of our core plans</h2>
            <p className="mt-7 text-center font-regulat text-sm text-black/60">Looking for advanced features? Check out our latest Growth plans or get a taste with our Free plan</p>
        </div>
        <div className="mt-20">
            <Tabs defaultValue="yearly">
                <TabsList>
                    <TabsTrigger value="monthly" className="text-base hover:cursor-pointer" onClick={() => setIsMonthly(() => true)}>
                        Monthly
                    </TabsTrigger>
                    <TabsTrigger value="yearly" className="text-base hover:cursor-pointer" onClick={() => setIsMonthly(() => false)}>
                        Yearly <span className="ml-3 text-sm font-semibold text-blue-700">Save 16%</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        <div className="flex flex-wrap gap-10 mt-20 justify-center overflow-x-hidden">
            <PricingCard planTitle="Basic" planDescription="Create interactive forms that connect to your workflow" price={["24", "242"]} isMonthly={isMonthly} features={["1 user", "2 TB of storage", "Connect all your devices", "Transfer files up to 50 GB", "30 days to restore deleted files"]} seeAllFeatureLink="/basic-features" />

            <PricingCard planTitle="Plus" planDescription="Make your forms more beautiful and on-brand" price={["59", "595"]} isMonthly={isMonthly} features={["1 user", "3 TB of storage", "Connect all your devices", "Transfer files up to 100 GB", "180 days to restore deleted files", "Brand files you share", "Password-protect any files"]} seeAllFeatureLink="/plus-features" />

            <PricingCard planTitle="Business" planDescription="Analyze performance and do more with your data" price={["83", "836"]} isMonthly={isMonthly} features={["3 user", "5 TB of storage", "Connect all your devices", "Transfer files up to 100 GB", "180 days to restore deleted files", "Brand files you share", "Password-protect any files", "Team folders for organisation"]} seeAllFeatureLink="/business-features" />
        </div>
    </section>
}