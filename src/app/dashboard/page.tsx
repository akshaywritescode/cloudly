import LogoutButton from "@/components/auth/LogoutButton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";


export default function Dashboard() {
    return <ProtectedRoute>
        <div>
            <LogoutButton />
        </div>
    </ProtectedRoute>
}