"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useLeaveWorkspaceModal } from "../hooks/use-leave-workspace-modal";
import { LeaveWorkspaceForm } from "./leave-workspace-form";
import { WorkspaceWithRole } from "../types";

interface LeaveWorkspaceModalProps {
  workspace: WorkspaceWithRole;
}

export const LeaveWorkspaceModal = ({
  workspace,
}: LeaveWorkspaceModalProps) => {
  const { isOpen, setIsOpen } = useLeaveWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <LeaveWorkspaceForm
        workspace={workspace}
        onCancel={() => setIsOpen(false)}
      />
    </ResponsiveModal>
  );
};
