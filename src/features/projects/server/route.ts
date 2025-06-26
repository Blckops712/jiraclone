import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";


import { DATABASE_ID, PROJECTS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono();

app.get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
        const user = c.get("user");
        const databases = c.get("databases");
        const { workspaceId } = c.req.valid("query");
        const member = await getMember(
            databases,
            userId: user.$id,
            workspaceId,
        );
        if (!member) {
            return c.json({ error: "Member not found" }, 404);
        }
        const projects = await databases.listDocuments(
            DATABASE_ID,
            PROJECTS_ID,
            [Query.equal("workspaceId", workspaceId)],
            [Query.orderDesc("$createdAt")]
        );
        return c.json({ data: projects });
    }
)

export default app;