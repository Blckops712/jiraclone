export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}

export interface MemberUser {
    $id: string;
    name: string;
    email: string;
}

export interface Member {
    $id: string;
    role: MemberRole;
    userId: string;
    workspaceId: string;
    $createdAt: string;
    user: MemberUser;
}

export interface MembersData {
    members: Member[];
    currentUserRole: MemberRole;
    total: number;
}
