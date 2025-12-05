import { onBoardUserToDatabase } from "@/modules/auth/actions"
import { UserButton } from "@clerk/nextjs"

async function Home() {
  await onBoardUserToDatabase()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <UserButton />
    </div>
  )
}
export default Home