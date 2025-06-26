import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { Query, ID } from "node-appwrite";

import { DATABASE_ID, PROJECTS_ID, IMAGES_BUCKET_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { MemberRole } from "@/features/members/types";

const app = new Hono()
    // Get all projects in a workspace
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const { workspaceId } = c.req.valid("query");

            // Check if user is a member of the workspace
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const projects = await databases.listDocuments(
                DATABASE_ID,
                PROJECTS_ID,
                [
                    Query.equal("workspaceId", workspaceId),
                    Query.orderDesc("$createdAt")
                ]
            );

            return c.json({ data: projects });
        }
    )
    // Get a specific project
    .get(
        "/:projectId",
        sessionMiddleware,
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const { projectId } = c.req.param();

            const project = await databases.getDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            );

            // Check if user is a member of the workspace
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId: project.workspaceId,
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            return c.json({ data: project });
        }
    )
    // Create a new project
    .post(
        "/",
        zValidator("form", createProjectSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user");
            const { name, description, workspaceId, status, priority, startDate, endDate, image } = c.req.valid("form");

            // Check if user is a member of the workspace
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId,
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            let uploadedImageUrl: string | undefined;

            if (image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                );
                const arrayBuffer = await storage.getFileView(
                    IMAGES_BUCKET_ID,
                    file.$id,
                );
                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            }

            const project = await databases.createDocument(
                DATABASE_ID,
                PROJECTS_ID,
                ID.unique(),
                {
                    name,
                    description,
                    workspaceId,
                    status,
                    priority,
                    startDate,
                    endDate,
                    imageUrl: uploadedImageUrl,
                    ownerId: user.$id,
                }
            );

            return c.json({ data: project });
        }
    )
    // Update a project
    .patch(
        "/:projectId",
        zValidator("form", updateProjectSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user");
            const { projectId } = c.req.param();
            const { name, description, status, priority, startDate, endDate, image } = c.req.valid("form");

            // Get the project first
            const existingProject = await databases.getDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            );

            // Check if user is a member of the workspace
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId: existingProject.workspaceId,
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // Only admins and project owners can update
            if (member.role !== MemberRole.ADMIN && existingProject.ownerId !== user.$id) {
                return c.json({ error: "You don't have permission to update this project" }, 403);
            }

            let uploadedImageUrl: string | undefined;

            if (image instanceof File) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                );
                const arrayBuffer = await storage.getFileView(
                    IMAGES_BUCKET_ID,
                    file.$id,
                );
                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
            } else {
                uploadedImageUrl = image;
            }

            const project = await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId,
                {
                    name,
                    description,
                    status,
                    priority,
                    startDate,
                    endDate,
                    imageUrl: uploadedImageUrl,
                }
            );

            return c.json({ data: project });
        }
    )
    // Delete a project
    .delete(
        "/:projectId",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const { projectId } = c.req.param();

            // Get the project first
            const project = await databases.getDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            );

            // Check if user is a member of the workspace
            const member = await getMember({
                databases,
                userId: user.$id,
                workspaceId: project.workspaceId,
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // Only admins and project owners can delete
            if (member.role !== MemberRole.ADMIN && project.ownerId !== user.$id) {
                return c.json({ error: "You don't have permission to delete this project" }, 403);
            }

            await databases.deleteDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectId
            );

            return c.json({ data: { $id: projectId } });
        }
    );

export default app;