
import { createSessionClient } from "@/lib/appwrite";
import { Query, Models } from "node-appwrite";
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { WorkspaceWithRole } from "./types";

// Function overloads for proper typing
export async function getWorkspaces(): Promise<Models.DocumentList<Models.Document>>;
export async function getWorkspaces(workspaceId: string): Promise<WorkspaceWithRole>;
export async function getWorkspaces(workspaceId?: string): Promise<Models.DocumentList<Models.Document> | WorkspaceWithRole> {
    try {
        const { databases, account } = await createSessionClient();
        const user = await account.get();

        // If getting a specific workspace
        if (workspaceId) {
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });

            if (!member) {
                throw new Error("Unauthorized");
            }

            const workspace = await databases.getDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            );

            return {
                ...workspace,
                role: member.role,
            } as WorkspaceWithRole;
        }

        // If getting all workspaces
        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        if (members.total === 0) {
            return { documents: [], total: 0 };
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

        return workspaces;

    } catch (error) {
        if (workspaceId) throw error;
        return { documents: [], total: 0 };
    }
}