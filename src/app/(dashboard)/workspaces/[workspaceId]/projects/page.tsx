import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjectsList } from "@/features/projects/components/projects-list";

interface ProjectsPageProps {
  params: {
    workspaceId: string;
  };
}

const ProjectsPage = async ({ params }: ProjectsPageProps) => {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  return <ProjectsList workspaceId={params.workspaceId} />;
};

export default ProjectsPage;
