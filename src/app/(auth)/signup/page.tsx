import PublicRoute from "@/components/auth/PublicRoute.";
import SignupForm from "@/components/auth/SignupForm";
import Logo from "@/components/ui/Logo";

export default function SignupPage() {
    return (
        <PublicRoute>
            <>
                <div className="flex flex-col gap-9 justify-center items-center">
                    <main className="p-10 flex flex-col items-center">
                        {/* logo & Heading */}
                        <div className="flex flex-col items-center gap-6 mt-6 mb-10">
                            <Logo color="text-black" />
                            <h1 className="text-4xl font-bold text-center leading-[2.7rem] lg:text-5xl lg:leading-[3.5rem]">Sign up to <br /> start storing</h1>
                        </div>
                        {/* Form */}
                        <div className="w-[300px]">
                            <SignupForm />
                        </div>
                    </main>
                </div>
            </>
        </PublicRoute>
    )
}