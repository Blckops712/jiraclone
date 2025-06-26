"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "./project-avatar";
import { Project, ProjectStatus, ProjectPriority } from "../types";
import { format } from "date-fns";
import { CalendarDays, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: Project;
  isOwner: boolean;
  isAdmin: boolean;
}

export const ProjectCard = ({
  project,
  isOwner,
  isAdmin,
}: ProjectCardProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const handleClick = () => {
    router.push(`/workspaces/${workspaceId}/projects/${project.$id}`);
  };

  const statusColors = {
    [ProjectStatus.ACTIVE]:
      "bg-green-500/20 text-green-700 dark:text-green-300",
    [ProjectStatus.COMPLETED]:
      "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    [ProjectStatus.ARCHIVED]: "bg-gray-500/20 text-gray-700 dark:text-gray-300",
  };

  const priorityColors = {
    [ProjectPriority.LOW]: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
    [ProjectPriority.MEDIUM]:
      "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
    [ProjectPriority.HIGH]:
      "bg-orange-500/20 text-orange-700 dark:text-orange-300",
    [ProjectPriority.URGENT]: "bg-red-500/20 text-red-700 dark:text-red-300",
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ProjectAvatar image={project.imageUrl} name={project.name} />
            <div>
              <h3 className="font-semibold text-lg">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>
          {(isOwner || isAdmin) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(
                      `/workspaces/${workspaceId}/projects/${project.$id}/settings`
                    );
                  }}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement delete
                  }}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={statusColors[project.status]}>
            {project.status}
          </Badge>
          <Badge
            variant="secondary"
            className={priorityColors[project.priority]}
          >
            {project.priority}
          </Badge>
        </div>
        {(project.startDate || project.endDate) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {project.startDate &&
                format(new Date(project.startDate), "MMM d")}
              {project.startDate && project.endDate && " - "}
              {project.endDate &&
                format(new Date(project.endDate), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
