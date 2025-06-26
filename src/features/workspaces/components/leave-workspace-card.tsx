"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLeaveWorkspaceModal } from "../hooks/use-leave-workspace-modal";

export const LeaveWorkspaceCard = () => {
  const { open } = useLeaveWorkspaceModal();

  return (
    <Card className="w-full lg:max-w-xl border-orange-500 bg-orange-50 dark:bg-orange-950/20">
      <CardHeader>
        <CardTitle className="text-orange-700 dark:text-orange-300">
          Leave Workspace
        </CardTitle>
        <CardDescription className="text-orange-600 dark:text-orange-400">
          Leaving this workspace will remove your access to all projects and
          data within it. You will need to be re-invited to join again.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          className="mt-6 w-fit bg-orange-600 hover:bg-orange-700 text-white"
          size="sm"
          variant="destructive"
          onClick={open}
        >
          Leave Workspace
        </Button>
      </CardContent>
    </Card>
  );
};
