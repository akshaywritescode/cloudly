"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type TSeparator = {
  className?: string;
};

export default function Separator({ className }: TSeparator) {
  return <div className={`${className} bg-black/10 h-[1px]`} />;
}