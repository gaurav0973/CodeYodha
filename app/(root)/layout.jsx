import { getCurrentUserRole } from "@/modules/auth/actions"
import Navbar from "@/modules/home/components/Navbar"


async function RootLayout({ children }) {
    const userRole = await getCurrentUserRole()
    // console.log("User Role in Layout:", userRole)
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
        <Navbar userRole={userRole}/>
        <div className="flex-1 flex flex-col px-4 pb-4">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#39e4a_1px,transparent_1px)] dark:bg-size-[16px_16px] bg-[radial-gradient(#dadde2_1px,transparent_1px)] bg-size-[16px_16px]" />
            {children}
        </div>
    </main>
  )
}
export default RootLayout