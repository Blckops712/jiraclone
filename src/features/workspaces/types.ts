import { Models } from "node-appwrite";
import { MemberRole } from "@/features/members/types";

export type Workspace = Models.Document & {
    name: string;
    imageUrl: string;
    inviteCode: string;
    userId: string;
};

export type WorkspaceWithRole = Workspace & {
    role: MemberRole;
};