"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteWorkspaceModal } from "../hooks/use-delete-workspace-modal";

export const DangerZoneCard = () => {
  const { open: openDeleteModal } = useDeleteWorkspaceModal();

  return (
    <Card className="w-full bg-accent border-destructive">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-destructive">
          Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Deleting a workspace is irreversible and will remove all associated
            data.
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="w-fit"
          onClick={openDeleteModal}
        >
          Delete Workspace
        </Button>
      </CardContent>
    </Card>
  );
};
