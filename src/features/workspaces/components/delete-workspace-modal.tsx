"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { DeleteWorkspaceForm } from "./delete-workspace-form";
import { useDeleteWorkspaceModal } from "../hooks/use-delete-workspace-modal";
import { Workspace } from "../types";

interface DeleteWorkspaceModalProps {
  workspace: Workspace;
}

export const DeleteWorkspaceModal = ({
  workspace,
}: DeleteWorkspaceModalProps) => {
  const { isOpen, setIsOpen, close } = useDeleteWorkspaceModal();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <DeleteWorkspaceForm onCancel={close} initialValues={workspace} />
    </ResponsiveModal>
  );
};
