import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { getMember } from "../utils";

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string() })),
        async (c) => {
            const { workspaceId } = c.req.valid("query");
            const databases = c.get("databases");
            const user = c.get("user");

            try {
                // Verify user is a member of this workspace
                const currentUserMember = await getMember({
                    databases,
                    workspaceId,
                    userId: user.$id
                });

                if (!currentUserMember) {
                    return c.json({ error: "Unauthorized" }, 401);
                }

                // Get all members of the workspace
                const members = await databases.listDocuments(
                    DATABASE_ID,
                    MEMBERS_ID,
                    [
                        Query.equal("workspaceId", workspaceId),
                        Query.orderAsc("$createdAt")
                    ]
                );

                // Fetch user details using admin client with Users API
                const { users } = await createAdminClient();

                const membersWithUserInfo = await Promise.all(
                    members.documents.map(async (member) => {
                        try {
                            // Get user details from Appwrite Users API
                            const userDetails = await users.get(member.userId);

                            return {
                                $id: member.$id,
                                role: member.role,
                                userId: member.userId,
                                workspaceId: member.workspaceId,
                                $createdAt: member.$createdAt,
                                user: {
                                    $id: userDetails.$id,
                                    name: userDetails.name,
                                    email: userDetails.email,
                                }
                            };
                        } catch (error) {
                            console.error(`Failed to fetch user details for ${member.userId}:`, error);

                            // Fallback to current user session data if it's the same user
                            if (member.userId === user.$id) {
                                return {
                                    $id: member.$id,
                                    role: member.role,
                                    userId: member.userId,
                                    workspaceId: member.workspaceId,
                                    $createdAt: member.$createdAt,
                                    user: {
                                        $id: user.$id,
                                        name: user.name,
                                        email: user.email,
                                    }
                                };
                            }

                            // Final fallback for other users
                            return {
                                $id: member.$id,
                                role: member.role,
                                userId: member.userId,
                                workspaceId: member.workspaceId,
                                $createdAt: member.$createdAt,
                                user: {
                                    $id: member.userId,
                                    name: "Unknown User",
                                    email: "unknown@example.com"
                                }
                            };
                        }
                    })
                );

                return c.json({
                    data: {
                        members: membersWithUserInfo,
                        currentUserRole: currentUserMember.role,
                        total: members.total
                    }
                });

            } catch (error) {
                console.error("Failed to fetch members:", error);
                return c.json({ error: "Internal server error" }, 500);
            }
        }
    );

export default app; 