"use client";

import { Input } from "@/components/ui/input";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";

type TPasswordInput = React.InputHTMLAttributes<HTMLInputElement> & {
    className?: string;
};

export default function PasswordInput({ className, ...rest }: TPasswordInput) {
    const [visibility, setVisibility] = useState(false);

    return (
        <div className="relative">
            <Input
                type={visibility ? "text" : "password"}
                className={className}
                {...rest} // Spread remaining props (like onClick, onChange, etc.)
            />
            {visibility ? (
                <EyeIcon
                    className="w-4 absolute right-5 top-1/2 -translate-y-1/2 text-black/40 cursor-pointer"
                    onClick={() => setVisibility((prevState) => !prevState)}
                />
            ) : (
                <EyeClosed
                    className="w-4 absolute right-5 top-1/2 -translate-y-1/2 text-black/40 cursor-pointer"
                    onClick={() => setVisibility((prevState) => !prevState)}
                />
            )}
        </div>
    );
}