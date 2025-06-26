import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { InviteCodeCard } from "@/features/workspaces/components/invite-code-card";
import { DangerZoneCard } from "@/features/workspaces/components/danger-zone-card";
import { DeleteWorkspaceModal } from "@/features/workspaces/components/delete-workspace-modal";
import { LeaveWorkspaceCard } from "@/features/workspaces/components/leave-workspace-card";
import { LeaveWorkspaceModal } from "@/features/workspaces/components/leave-workspace-modal";
import { WorkspaceWithRole } from "@/features/workspaces/types";
import { MemberRole } from "@/features/members/types";

interface WorkspaceIDSettingsPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIDSettingsPage = async ({
  params,
}: WorkspaceIDSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) return redirect("/sign-in");

  let workspace;
  try {
    workspace = await getWorkspaces(params.workspaceId);
  } catch {
    redirect("/");
  }

  const workspaceWithRole = workspace as WorkspaceWithRole;
  const isAdmin = workspaceWithRole.role === MemberRole.ADMIN;

  return (
    <div className="w-full lg:max-w-xl space-y-4">
      <EditWorkspaceForm initialValues={workspaceWithRole} />
      <InviteCodeCard workspace={workspaceWithRole} />
      {isAdmin && (
        <>
          <DangerZoneCard />
          <DeleteWorkspaceModal workspace={workspaceWithRole} />
        </>
      )}
      {!isAdmin && (
        <>
          <LeaveWorkspaceCard />
          <LeaveWorkspaceModal workspace={workspaceWithRole} />
        </>
      )}
    </div>
  );
};

export default WorkspaceIDSettingsPage;
