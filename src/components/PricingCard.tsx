"use client";

import Separator from "./Separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingCard({
  planTitle,
  planDescription,
  price,
  features,
  isMonthly,
  seeAllFeatureLink,
}: {
  planTitle: string;
  planDescription: string;
  price: string[];
  features: string[];
  isMonthly: boolean;
  seeAllFeatureLink: string;
}) {
  return (
    <Card className="w-[350px] flex flex-col items-center relative">
      <CardHeader>
        <CardTitle className="text-center mb-5">{planTitle}</CardTitle>
        <CardDescription className="text-center">
          {planDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full mb-24">
        <div className="flex flex-col items-center mt-10 gap-5">
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-medium text-4xl">
                {isMonthly ? price[0] : price[1]} USD
              </h1>
              <span className="text-gray-600">{isMonthly ? "/mo" : "/y"}</span>
            </div>
          </div>
          <div>
            <Button>Get {planTitle}</Button>
          </div>
        </div>

        <div className="flex flex-col mt-5">
          <ul>
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex gap-3 flex-col font-normal text-sm"
              >
                <Separator className="mt-3 bg-black/10" />
                <div className="flex gap-2">
                  <Check className="w-5" />
                  {feature}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between absolute h-16 w-full  bottom-0">
        <Link
          href={seeAllFeatureLink}
          className="font-medium text-sm underline underline-offset-1 absolute bottom-5 left-1/2 -translate-x-1/2"
        >
          See all Features
        </Link>
      </CardFooter>
    </Card>
  );
}