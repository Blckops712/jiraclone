import { z } from "zod";
import { ProjectStatus, ProjectPriority } from "@/features/projects/types";

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, "Project name is required"),
    description: z.string().optional(),
    workspaceId: z.string(),
    status: z.nativeEnum(ProjectStatus).default(ProjectStatus.ACTIVE),
    priority: z.nativeEnum(ProjectPriority).default(ProjectPriority.MEDIUM),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ]).optional(),
});

export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, "Project name is required"),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    priority: z.nativeEnum(ProjectPriority),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value),
    ]).optional(),
});