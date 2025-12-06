import { Button } from "@/components/ui/button"
import ModeToggle from "@/components/ui/mode-toggle"
import { UserRole } from "@/generated/client"
import { getCurrentUserRole } from "@/modules/auth/actions"
import CreateProblemForm from "@/modules/problems/components/create-problem-form" // Check your import path
import { currentUser } from "@clerk/nextjs/server"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

async function CreateProblemPage() {
    const user = await currentUser()
    const userRole = await getCurrentUserRole()

    if (userRole !== UserRole.ADMIN) {
        return redirect("/")
    }

    return (
        // Changed: Removed 'items-center', added 'max-w-7xl' and 'mx-auto' for proper centering without shrinking
        <section className="container mx-auto py-8 px-4 w-full max-w-7xl">
            
            {/* Header Section */}
            <div className="flex flex-row justify-between items-center w-full mb-8">
                <div className="flex items-center gap-4">
                    <Link href={"/"}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-foreground">
                        Welcome, {user?.firstName}
                    </h1>
                </div>
                <ModeToggle />
            </div>

            {/* The Form */}
            <div className="w-full">
                <CreateProblemForm />
            </div>
        </section>
    )
}

export default CreateProblemPage