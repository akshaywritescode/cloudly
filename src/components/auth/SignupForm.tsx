"use client";

import { useForm } from "react-hook-form";
import { signUpSchema } from "@/validations/signup.validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Loader2Icon, Plus } from "lucide-react";
import { useWatch } from "react-hook-form";
import PasswordInput from "@/components/PasswordInput";
import Separator from "@/components/Separator";
import OAuthComponent from "@/components/auth/OAuthComponent";
import { ID } from "appwrite";
import { getAccount } from "@/lib/appwrite";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


// Infer types from Zod schema
type SignUpFormValues = z.infer<typeof signUpSchema>;


export default function SignupForm() {
    const [backendError, setBackendError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
    });

    // Watch fields for real-time validation
    const password = useWatch({ control, name: "password" });
    const confirmPassword = useWatch({ control, name: "confirmPassword" });

    // Real-time validation checks
    const hasUppercase = /[A-Z]/.test(password || "");
    const hasLowercase = /[a-z]/.test(password || "");
    const hasNumber = /[0-9]/.test(password || "");
    const hasSymbol = /[^a-zA-Z0-9]/.test(password || "");
    const isMinLength = (password || "").length >= 8;
    const passwordsMatch = (() => {
        if (!password || !confirmPassword) return false;
        return password === confirmPassword;
    })();

    const validationData = [
        { state: hasUppercase, text: "At least one uppercase letter" },
        { state: hasLowercase, text: "At least one lowercase letter" },
        { state: hasNumber, text: "At least one number" },
        { state: hasSymbol, text: "At least one symbol" },
        { state: isMinLength, text: "Minimum 8 characters" },
        { state: passwordsMatch, text: "Passwords match" },
    ];

    const onSubmit = async (data: SignUpFormValues) => {
        setIsLoading(true);
        setBackendError(""); 

        try {
            const account = getAccount();
            await account.create(
                ID.unique(),
                data.email,
                data.password,
                data.name
            );
            await account.createEmailPasswordSession(data.email, data.password);
            await account.createVerification(`${window.location.origin}/verify-account`);
            localStorage.setItem('verify-email', data.email);
            router.push("/sent-verify-mail");

        } catch (error: any) {
            setBackendError(error?.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* name input */}
            <div className="mb-4">
                <Input
                    placeholder="Name"
                    type="text"
                    {...register("name")}
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-2 ml-2">
                        {errors.name.message}
                    </p>
                )}
            </div>
            {/* email input */}
            <div className="mb-4">
                <Input
                    placeholder="Email"
                    type="email"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-2">
                        {errors.email.message}
                    </p>
                )}
            </div>
            {/* password input */}
            <div className="flex flex-col gap-4 mb-2">
                <PasswordInput
                    placeholder="Password"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm ml-2">
                        {errors.password.message}
                    </p>
                )}

                <PasswordInput
                    placeholder="Confirm password"
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm ml-2">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>
            {/* validation conditions */}
            <div className="mt-6 mb-4 space-y-1">
                {validationData.map(({ state, text }) => (
                    <div className="flex items-center gap-2 text-sm" key={text}>
                        {state ? (
                            <Check className="w-4 text-green-600" />
                        ) : (
                            <Plus className="rotate-45 w-4 text-gray-400" />
                        )}
                        <span className={state ? "text-green-600" : "text-gray-500"}>
                            {text}
                        </span>
                    </div>
                ))}
            </div>
            {/* showing backend error */}
            {backendError && (
                <p className="text-red-500 text-sm ml-2 mb-2">
                    {backendError}
                </p>
            )}
            {/* Submit form btn */}
            <Button
                type="submit"
                className="btn-primary my-2"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                        Setting things up...
                    </>
                ) : (
                    "Sign Up Now"
                )}
            </Button>
        </form>
        <div className="my-10 relative">
            <span className="bg-white p-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">or</span>
            <Separator />
        </div>
        {/* OAuthComponent */}
        <OAuthComponent />
        <Separator />
        <span className="text-sm mt-6 flex justify-center text-black/60">
            Already have an account?<span className="underline text-black cursor-pointer">&nbsp;<Link href={"/login"}>Log in here</Link></span>
        </span>
        <div className="mt-10 text-center">
            <span className="text-xs text-center" >
                This site is protected by reCAPTCHA and the Google
                Privacy Policy and Terms of Service apply.
            </span>
        </div>
    </div>
}