"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkspaceAvatar } from "./workspace-avatar";
import { useJoinWorkspace } from "../api/use-join-workspace";

interface JoinWorkspaceFormProps {
  workspace: {
    $id: string;
    name: string;
    imageUrl: string;
    inviteCode: string;
  };
  inviteCode: string;
}

export const JoinWorkspaceForm = ({
  workspace,
  inviteCode,
}: JoinWorkspaceFormProps) => {
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

  const onJoin = () => {
    joinWorkspace({
      param: { workspaceId: workspace.$id },
      json: { inviteCode },
    });
  };

  return (
    <Card className="w-full max-w-md bg-accent">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <WorkspaceAvatar
            image={workspace.imageUrl}
            name={workspace.name}
            className="size-16"
          />
        </div>
        <CardTitle className="text-2xl font-bold">
          Join {workspace.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          You have been invited to join this workspace
        </p>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onJoin}
          disabled={isPending}
          className="w-full"
          size="lg"
        >
          Join Workspace
        </Button>
      </CardContent>
    </Card>
  );
};
