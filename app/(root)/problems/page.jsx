import { getAllProblems } from "@/modules/problems/action";
import ProblemsTable from "@/modules/problems/components/problems-table";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

async function ProblemsPage() {
  const user = await currentUser();
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true, role: true },
    });
  }

  const result = await getAllProblems();

  console.log("Problems fetch result:", result);

  if (!result.success || result.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-2">Failed to fetch problems</p>
          <p className="text-sm text-gray-500">
            {result.error || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-32">
      <ProblemsTable problems={result.data || []} user={dbUser} />
    </div>
  );
}
export default ProblemsPage;
