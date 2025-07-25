"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validations/login.validations";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import PasswordInput from "@/components/PasswordInput";
import Separator from "@/components/Separator";
import OAuthComponent from "@/components/auth/OAuthComponent";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAccount } from "@/lib/appwrite";

// Infer types from Zod schema
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [backendError, setBackendError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setBackendError("");

    try {
      const account = getAccount();
      await account.createEmailPasswordSession(data.email, data.password);
      router.push("/dashboard");
    } catch (error: any) {
      setBackendError(error?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* email input */}
        <div className="mb-4">
          <Input placeholder="Email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-2 ml-2">{errors.email.message}</p>
          )}
        </div>

        {/* password input */}
        <div className="mb-1">
          <PasswordInput placeholder="Password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-sm mt-2 ml-2">{errors.password.message}</p>
          )}
        </div>

        <Link href={"/forgot-password"} className="text-xs text-blue-600 ml-2">Forgot Password?</Link>

        {/* backend error */}
        {backendError && (
          <p className="text-red-500 text-sm ml-2 mt-3">{backendError}</p>
        )}

        {/* Submit button */}
        <Button type="submit" className="btn-primary my-5" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
              Logging you in...
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      {/* OR separator */}
      <div className="my-10 relative">
        <span className="bg-white p-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          or
        </span>
        <Separator />
      </div>

      {/* OAuth */}
      <OAuthComponent />
      <Separator />

      {/* redirect to signup */}
      <span className="text-sm mt-6 flex justify-center text-black/60">
        Don't have an account?
        <span className="underline text-black cursor-pointer">
          &nbsp;<Link href={"/signup"}>Sign up here</Link>
        </span>
      </span>

      <div className="mt-10 text-center">
        <span className="text-xs text-center">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </span>
      </div>
    </div>
  );
}
