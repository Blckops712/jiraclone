"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeaveWorkspace } from "../api/use-leave-workspace";
import { WorkspaceWithRole } from "../types";

interface LeaveWorkspaceFormProps {
  workspace: WorkspaceWithRole;
  onCancel?: () => void;
}

export const LeaveWorkspaceForm = ({
  workspace,
  onCancel,
}: LeaveWorkspaceFormProps) => {
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();
  const { mutate: leaveWorkspace, isPending } = useLeaveWorkspace();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (confirmText !== workspace.name) {
      return;
    }

    leaveWorkspace(
      { param: { workspaceId: workspace.$id } },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold text-orange-700 dark:text-orange-300">
          Leave &quot;{workspace.name}&quot;
        </CardTitle>
        <CardDescription>
          This action cannot be undone. You will lose access to this workspace
          and all its projects.
          <br />
          <strong>You will need to be re-invited to join again.</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-7 pt-0">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Type <strong>{workspace.name}</strong> to confirm:
              </p>
              <Input
                placeholder="Workspace name"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending || confirmText !== workspace.name}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isPending ? "Leaving..." : "Leave Workspace"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
