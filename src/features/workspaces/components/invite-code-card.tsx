"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { useResetInviteCode } from "../api/use-reset-invite-code";
import { useGetWorkspace } from "../api/use-get-workspace";
import { Workspace } from "../types";
import { toast } from "sonner";

interface InviteCodeCardProps {
  workspace: Workspace;
}

export const InviteCodeCard = ({
  workspace: initialWorkspace,
}: InviteCodeCardProps) => {
  const { mutate: resetInviteCode, isPending } = useResetInviteCode();
  const { data: workspace } = useGetWorkspace({
    workspaceId: initialWorkspace.$id,
  });

  // Use the fresh data from the query, fallback to initial data
  const currentWorkspace = workspace || initialWorkspace;
  const inviteLink = `${window.location.origin}/workspaces/${currentWorkspace.$id}/join/${currentWorkspace.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied to clipboard");
  };

  const onReset = () => {
    resetInviteCode({
      param: { workspaceId: currentWorkspace.$id },
    });
  };

  return (
    <Card className="w-full bg-accent">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Invite Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Share this link to invite others to your workspace
          </p>
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={onCopy}>
              <Copy className="size-4" />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Reset the invite code to invalidate all existing invite links
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isPending}
            className="w-fit"
          >
            <RefreshCw className="size-4 mr-2" />
            Reset Invite Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
