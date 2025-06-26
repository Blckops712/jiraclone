import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";


const app = new Hono()
    .get("/", sessionMiddleware, async (c) => {
        const user = c.get("user");
        const databases = c.get("databases");

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );
        if (members.total === 0) {
            return c.json({ data: { documents: [], total: 0 } });
        }

        const workspaceIds = members.documents.map((member) => member.workspaceId);

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds)
            ]
        );
        return c.json({ data: workspaces });
    })
    .get(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            const user = c.get("user");
            const databases = c.get("databases");
            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const workspace = await databases.getDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );

            return c.json({ data: workspace });
        }
    )
    .post(
        "/",
        zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const storage = c.get("storage");

            const { name, image } = c.req.valid("form");

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

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    imageUrl: uploadedImageUrl,
                    inviteCode: generateInviteCode(10),
                },

            );

            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId: workspace.$id,
                    userId: user.$id,
                    role: MemberRole.ADMIN,
                },



            );

            return c.json({ data: workspace });
        }
    )
    .patch(
        "/:workspaceId",
        zValidator("form", updateWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const storage = c.get("storage");
            const { workspaceId } = c.req.param();

            const { name, image } = c.req.valid("form");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "You are not authorized to update this workspace" }, 401);
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

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    name,
                    imageUrl: uploadedImageUrl,
                }
            );

            return c.json({ data: workspace });
        }
    )
    .patch(
        "/:workspaceId/reset-invite-code",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "You are not authorized to reset the invite code" }, 401);
            }

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    inviteCode: generateInviteCode(10),
                }
            );

            return c.json({ data: workspace });
        }
    )
    .get(
        "/:workspaceId/join/:inviteCode",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const { workspaceId, inviteCode } = c.req.param();

            try {
                const workspace = await databases.getDocument(
                    DATABASE_ID,
                    WORKSPACES_ID,
                    workspaceId,
                );

                if (workspace.inviteCode !== inviteCode) {
                    return c.json({ error: "Invalid invite code" }, 400);
                }

                // Return basic workspace info for join page
                return c.json({
                    data: {
                        $id: workspace.$id,
                        name: workspace.name,
                        imageUrl: workspace.imageUrl,
                        inviteCode: workspace.inviteCode
                    }
                });
            } catch {
                return c.json({ error: "Workspace not found" }, 404);
            }
        }
    )
    .get(
        "/:workspaceId/join/:inviteCode/info",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const { workspaceId, inviteCode } = c.req.param();

            try {
                const workspace = await databases.getDocument(
                    DATABASE_ID,
                    WORKSPACES_ID,
                    workspaceId,
                );

                if (workspace.inviteCode !== inviteCode) {
                    return c.json({ error: "Invalid invite code" }, 400);
                }

                // Return minimal info for public access (no auth required)
                return c.json({
                    data: {
                        name: workspace.name,
                        imageUrl: workspace.imageUrl,
                    }
                });
            } catch {
                return c.json({ error: "Workspace not found" }, 404);
            }
        }
    )
    .post(
        "/:workspaceId/join",
        zValidator("json", z.object({ inviteCode: z.string() })),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const { workspaceId } = c.req.param();
            const { inviteCode } = c.req.valid("json");

            const workspace = await databases.getDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );

            if (workspace.inviteCode !== inviteCode) {
                return c.json({ error: "Invalid invite code" }, 400);
            }

            // Check if user is already a member
            const existingMember = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (existingMember) {
                return c.json({ error: "You are already a member of this workspace" }, 400);
            }

            // Create member record
            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId,
                    userId: user.$id,
                    role: MemberRole.MEMBER,
                }
            );

            return c.json({ data: workspace });
        }
    )
    .delete(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member || member.role !== MemberRole.ADMIN) {
                return c.json({ error: "You are not authorized to delete this workspace" }, 401);
            }

            // Delete all members first
            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", workspaceId)]
            );

            for (const member of members.documents) {
                await databases.deleteDocument(
                    DATABASE_ID,
                    MEMBERS_ID,
                    member.$id
                );
            }

            // Delete the workspace
            await databases.deleteDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            );

            return c.json({ data: { $id: workspaceId } });
        }
    )
    .delete(
        "/:workspaceId/members",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");
            const { workspaceId } = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member) {
                return c.json({ error: "You are not a member of this workspace" }, 401);
            }

            if (member.role === MemberRole.ADMIN) {
                return c.json({ error: "Admins cannot leave the workspace. You must delete it or transfer ownership." }, 400);
            }

            // Delete the member record
            await databases.deleteDocument(
                DATABASE_ID,
                MEMBERS_ID,
                member.$id
            );

            return c.json({ data: { $id: member.$id } });
        }
    )

export default app;