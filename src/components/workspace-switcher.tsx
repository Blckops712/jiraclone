"use client";

import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

// TODO: Add workspace ORG
export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };
  const { isMobile } = useSidebar();
  const { data: workspaces } = useGetWorkspaces();
  const { open } = useCreateWorkspaceModal();

  const currentWorkspace = workspaces?.documents?.find(
    (workspace) => workspace.$id === workspaceId
  );

  if (!workspaces?.documents || workspaces.documents.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" onClick={open}>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <Plus className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">No Workspace</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Select
          value={workspaceId}
          onValueChange={(value) => {
            if (value === "__create_workspace__") {
              open();
            } else {
              onSelect(value);
            }
          }}
        >
          <SelectTrigger className="w-full h-auto p-0 border-0 bg-transparent shadow-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:hidden">
            <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm w-full">
              <WorkspaceAvatar
                image={currentWorkspace?.imageUrl}
                name={currentWorkspace?.name}
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentWorkspace?.name}
                </span>
                <p className="truncate text-xs text-muted-foreground">
                  {/* TODO: Add workspace ORG */}
                  Skullcandy
                </p>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </div>
          </SelectTrigger>
          <SelectContent
            className="min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <div className="text-muted-foreground text-xs px-2 py-1.5">
              Workspaces
            </div>
            {workspaces?.documents.map((workspace, index: number) => (
              <SelectItem
                key={workspace.$id}
                value={workspace.$id}
                className="gap-2 p-2"
              >
                <div className="flex items-center gap-2">
                  <WorkspaceAvatar
                    image={workspace.imageUrl}
                    name={workspace.name}
                  />
                  {workspace.name}
                  <span className="ml-auto text-xs text-muted-foreground justify-right">
                    ⌘{index + 1}
                  </span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value="__create_workspace__" className="gap-2 p-2">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-md object-cover border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add workspace
                </div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
