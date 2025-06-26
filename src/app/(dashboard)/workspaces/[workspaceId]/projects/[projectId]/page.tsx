"use client";

import { useGetProject } from "@/features/projects/api/use-get-project";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";
import { ProjectStatus, ProjectPriority } from "@/features/projects/types";

interface ProjectPageProps {
  params: {
    workspaceId: string;
    projectId: string;
  };
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const { data: project, isLoading } = useGetProject({
    projectId: params.projectId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">Project not found</h2>
        <p className="text-muted-foreground mt-2">
          The project you're looking for doesn't exist or you don't have access
          to it.
        </p>
      </div>
    );
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <ProjectAvatar
          image={project.imageUrl}
          name={project.name}
          className="size-16"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <Badge variant="secondary" className={statusColors[project.status]}>
              {project.status}
            </Badge>
            <Badge
              variant="secondary"
              className={priorityColors[project.priority]}
            >
              {project.priority} priority
            </Badge>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="size-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.startDate && (
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="text-sm font-medium">
                    {format(new Date(project.startDate), "PPP")}
                  </p>
                </div>
              )}
              {project.endDate && (
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="text-sm font-medium">
                    {format(new Date(project.endDate), "PPP")}
                  </p>
                </div>
              )}
              {!project.startDate && !project.endDate && (
                <p className="text-sm text-muted-foreground">No timeline set</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="size-4" />
              Project Owner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">Loading...</p>
            <p className="text-xs text-muted-foreground">
              Created on {format(new Date(project.$createdAt), "PPP")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="size-4" />
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {format(new Date(project.$updatedAt), "PPP")}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(project.$updatedAt), "p")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <p>Task management coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectPage;
