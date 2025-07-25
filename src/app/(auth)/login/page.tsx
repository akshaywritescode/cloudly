import LoginForm from "@/components/auth/LoginForm";
import PublicRoute from "@/components/auth/PublicRoute";
import Logo from "@/components/ui/Logo";


export default function LoginPage() {
    return (
        <PublicRoute>
            <>
                <div className="flex flex-col gap-9 justify-center items-center">
                    <main className="p-10 flex flex-col items-center">
                        {/* logo & Heading */}
                        <div className="flex flex-col items-center gap-6 mt-6 mb-10">
                            <Logo color="text-black" />
                            <h1 className="text-4xl font-bold text-center leading-[2.7rem] lg:text-5xl lg:leading-[3.5rem]">Welcome Back</h1>
                        </div>
                        {/* Form */}
                        <div className="w-[300px]">
                            <LoginForm />
                        </div>
                    </main>
                </div>
            </>
        </PublicRoute>
    )
}