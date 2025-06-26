import { Models } from "node-appwrite";

export enum ProjectStatus {
    ACTIVE = "active",
    ARCHIVED = "archived",
    COMPLETED = "completed"
}

export enum ProjectPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}

export type Project = Models.Document & {
    name: string;
    description?: string;
    workspaceId: string;
    imageUrl?: string;
    status: ProjectStatus;
    priority: ProjectPriority;
    startDate?: string;
    endDate?: string;
    ownerId: string;
};