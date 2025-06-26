"use client";

import { useGetWorkspaceJoin } from "@/features/workspaces/api/use-get-workspace-join";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { Skeleton } from "@/components/ui/skeleton";

interface JoinWorkspaceClientProps {
  workspaceId: string;
  inviteCode: string;
}

export const JoinWorkspaceClient = ({
  workspaceId,
  inviteCode,
}: JoinWorkspaceClientProps) => {
  const {
    data: workspace,
    isLoading,
    error,
  } = useGetWorkspaceJoin({ workspaceId, inviteCode });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            Invalid Invite Link
          </h1>
          <p className="text-muted-foreground">
            This invite link is invalid, expired, or the workspace doesn&apos;t
            exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <JoinWorkspaceForm workspace={workspace} inviteCode={inviteCode} />
    </div>
  );
};
