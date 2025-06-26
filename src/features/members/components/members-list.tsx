"use client";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users, Plus } from "lucide-react";
import { Fragment } from "react";
import { useCurrent } from "@/features/auth/api/use-current";

interface MembersListProps {
  workspaceId: string;
}

export const MembersList = ({ workspaceId }: MembersListProps) => {
  const { data: currentUser } = useCurrent();
  const { data: membersData, isLoading } = useGetMembers({ workspaceId });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Users className="size-5 text-primary" />
            <h1 className="text-2xl font-bold">Members</h1>
          </div>
        </div>
        <p className="text-muted-foreground">Loading members...</p>
      </div>
    );
  }

  if (!membersData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <Users className="size-5 text-primary" />
            <h1 className="text-2xl font-bold">Members</h1>
          </div>
        </div>
        <p className="text-muted-foreground">Failed to load members.</p>
      </div>
    );
  }

  const { members, currentUserRole, total } = membersData;
  const isAdmin = currentUserRole === "ADMIN";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Users className="size-5 text-primary" />
          <h1 className="text-2xl font-bold">Members</h1>
        </div>
        {isAdmin && (
          <Button size="sm">
            <Plus className="size-4 mr-2" />
            Invite Members
          </Button>
        )}
      </div>
      <p className="text-muted-foreground">
        Manage workspace members and their roles
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Workspace Members ({total})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {members.map((member, index) => (
            <Fragment key={member.$id}>
              <div className="flex items-center gap-x-4 px-6 py-3">
                <div className="size-10 relative flex items-center justify-center bg-primary text-primary-foreground font-medium text-sm uppercase rounded-full">
                  {member.user.name.charAt(0)}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-x-2">
                    <p className="text-sm font-medium">{member.user.name}</p>
                    {currentUser?.$id === member.userId && (
                      <span className="text-xs text-muted-foreground">You</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Joined {format(new Date(member.$createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-x-2">
                  <Badge
                    variant={member.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {member.role}
                  </Badge>
                  {isAdmin && member.userId !== currentUser?.$id && (
                    <Button variant="outline" size="sm">
                      •••
                    </Button>
                  )}
                </div>
              </div>
              {index < members.length - 1 && <Separator />}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
