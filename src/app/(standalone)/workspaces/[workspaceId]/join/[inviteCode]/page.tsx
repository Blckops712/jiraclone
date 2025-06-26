import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { JoinWorkspaceClient } from "./client";

interface JoinWorkspacePageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProps) => {
  const user = await getCurrent();

  if (!user) {
    const inviteUrl = `/workspaces/${params.workspaceId}/join/${params.inviteCode}`;
    const signUpUrl = `/sign-up?${new URLSearchParams({
      redirect: inviteUrl,
      workspaceId: params.workspaceId,
      inviteCode: params.inviteCode,
    })}`;

    return redirect(signUpUrl);
  }

  return (
    <JoinWorkspaceClient
      workspaceId={params.workspaceId}
      inviteCode={params.inviteCode}
    />
  );
};

export default JoinWorkspacePage;
