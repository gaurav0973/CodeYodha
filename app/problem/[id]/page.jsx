import { getProblemById } from "@/modules/problems/action";
import ProblemWorkspace from "@/modules/problems/components/view/ProblemWorkspace";
import { notFound } from "next/navigation";

export default async function ProblemPage({ params }) {
  const { id } = await params;
  const { data: problem, success } = await getProblemById(id);

  if (!success || !problem) {
    return notFound();
  }

  return <ProblemWorkspace problem={problem} />;
}
