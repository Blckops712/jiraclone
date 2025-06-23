# Organization Implementation Guide - JiraClone

🤖 **Implementation Reference for Adding Organization Functionality**

## Overview

This document outlines the implementation plan for adding organization functionality to the JiraClone application. The approach maintains existing workspace functionality while adding an optional organization layer.

---

## Database Structure (Appwrite Collections)

### New Collections Required

#### 1. Organizations Collection

```typescript
{
  $id: string,
  name: string,
  description?: string,
  imageUrl?: string,
  ownerId: string,        // User who created the organization
  $createdAt: string,
  $updatedAt: string
}
```

#### 2. Organization Members Collection

```typescript
{
  $id: string,
  organizationId: string,
  userId: string,
  role: "OWNER" | "ADMIN" | "MEMBER",
  invitedBy: string,      // UserId who sent invite
  joinedAt: string
}
```

#### 3. Organization Invitations Collection

```typescript
{
  $id: string,
  organizationId: string,
  email: string,
  role: "ADMIN" | "MEMBER",
  invitedBy: string,
  token: string,          // Unique invitation token
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED",
  expiresAt: string
}
```

### Updated Collections

#### Workspaces Collection (Add Optional Field)

```typescript
{
  // ... existing fields
  organizationId?: string  // null = personal workspace, string = org workspace
}
```

---

## Configuration Updates

### src/config.ts

```typescript
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
export const WORKSPACES_ID = process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!;
export const IMAGES_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID!;
export const MEMBERS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!;

// Add these new collection IDs
export const ORGANIZATIONS_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORGANIZATIONS_ID!;
export const ORGANIZATION_MEMBERS_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORGANIZATION_MEMBERS_ID!;
export const ORGANIZATION_INVITATIONS_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORGANIZATION_INVITATIONS_ID!;
```

### Environment Variables

```env
NEXT_PUBLIC_APPWRITE_ORGANIZATIONS_ID=your_organizations_collection_id
NEXT_PUBLIC_APPWRITE_ORGANIZATION_MEMBERS_ID=your_org_members_collection_id
NEXT_PUBLIC_APPWRITE_ORGANIZATION_INVITATIONS_ID=your_org_invitations_collection_id
```

---

## Feature Structure

### src/features/organizations/

```
organizations/
├── api/
│   ├── use-create-organization.ts
│   ├── use-get-organizations.ts
│   ├── use-get-organization.ts
│   ├── use-update-organization.ts
│   ├── use-delete-organization.ts
│   ├── use-invite-member.ts
│   ├── use-get-organization-members.ts
│   ├── use-remove-member.ts
│   ├── use-accept-invitation.ts
│   └── use-reject-invitation.ts
├── components/
│   ├── create-organization-form.tsx
│   ├── organization-avatar.tsx
│   ├── organization-settings.tsx
│   ├── invite-member-form.tsx
│   ├── member-list.tsx
│   ├── invitation-card.tsx
│   └── organization-switcher.tsx
├── schemas.ts
├── types.ts
└── server/
    └── route.ts
```

---

## Type Definitions

### src/features/members/types.ts (Update)

```typescript
export enum MemberRole {
  OWNER = "OWNER", // Add for organization owners
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}
```

### src/features/organizations/types.ts

```typescript
import { Models } from "node-appwrite";

export type Organization = Models.Document & {
  name: string;
  description?: string;
  imageUrl?: string;
  ownerId: string;
};

export type OrganizationMember = Models.Document & {
  organizationId: string;
  userId: string;
  role: MemberRole;
  invitedBy: string;
  joinedAt: string;
};

export type OrganizationInvitation = Models.Document & {
  organizationId: string;
  email: string;
  role: MemberRole;
  invitedBy: string;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
};
```

---

## Schema Definitions

### src/features/organizations/schemas.ts

```typescript
import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});
```

---

## Server Routes

### src/features/organizations/server/route.ts

```typescript
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  ORGANIZATIONS_ID,
  ORGANIZATION_MEMBERS_ID,
  ORGANIZATION_INVITATIONS_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { createOrganizationSchema, inviteMemberSchema } from "../schemas";
import { MemberRole } from "@/features/members/types";

const app = new Hono()
  // Get user's organizations
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const members = await databases.listDocuments(
      DATABASE_ID,
      ORGANIZATION_MEMBERS_ID,
      [Query.equal("userId", user.$id)]
    );

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const organizationIds = members.documents.map(
      (member) => member.organizationId
    );

    const organizations = await databases.listDocuments(
      DATABASE_ID,
      ORGANIZATIONS_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", organizationIds)]
    );

    return c.json({ data: organizations });
  })

  // Create organization
  .post(
    "/",
    zValidator("form", createOrganizationSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, description, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );
        const arrayBuffer = await storage.getFileView(
          IMAGES_BUCKET_ID,
          file.$id
        );
        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const organization = await databases.createDocument(
        DATABASE_ID,
        ORGANIZATIONS_ID,
        ID.unique(),
        {
          name,
          description,
          ownerId: user.$id,
          imageUrl: uploadedImageUrl,
        }
      );

      // Add creator as OWNER
      await databases.createDocument(
        DATABASE_ID,
        ORGANIZATION_MEMBERS_ID,
        ID.unique(),
        {
          organizationId: organization.$id,
          userId: user.$id,
          role: MemberRole.OWNER,
          invitedBy: user.$id,
          joinedAt: new Date().toISOString(),
        }
      );

      return c.json({ data: organization });
    }
  )

  // Invite member
  .post(
    "/:organizationId/invite",
    zValidator("json", inviteMemberSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const { organizationId } = c.req.param();
      const { email, role } = c.req.valid("json");

      // Check if user has permission to invite
      const userMembership = await databases.listDocuments(
        DATABASE_ID,
        ORGANIZATION_MEMBERS_ID,
        [
          Query.equal("organizationId", organizationId),
          Query.equal("userId", user.$id),
        ]
      );

      if (
        userMembership.total === 0 ||
        !["OWNER", "ADMIN"].includes(userMembership.documents[0].role)
      ) {
        return c.json({ error: "Insufficient permissions" }, 403);
      }

      // Create invitation
      const invitation = await databases.createDocument(
        DATABASE_ID,
        ORGANIZATION_INVITATIONS_ID,
        ID.unique(),
        {
          organizationId,
          email,
          role,
          invitedBy: user.$id,
          token: ID.unique(),
          status: "PENDING",
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days
        }
      );

      // TODO: Send email invitation

      return c.json({ data: invitation });
    }
  );

export default app;
```

---

## API Hooks

### Example: src/features/organizations/api/use-create-organization.ts

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.organizations.$post>;
type RequestType = InferRequestType<typeof client.api.organizations.$post>;

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const response = await client.api.organizations["$post"]({ form });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      toast.success("Organization created successfully");
    },
    onError: () => {
      toast.error("Failed to create organization");
    },
  });

  return mutation;
};
```

---

## Component Examples

### src/features/organizations/components/create-organization-form.tsx

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createOrganizationSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateOrganization } from "../api/use-create-organization";

interface CreateOrganizationFormProps {
  onCancel?: () => void;
}

export const CreateOrganizationForm = ({
  onCancel,
}: CreateOrganizationFormProps) => {
  const { mutate, isPending } = useCreateOrganization();

  const form = useForm<z.infer<typeof createOrganizationSchema>>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createOrganizationSchema>) => {
    mutate(
      { form: values },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none bg-accent">
      <CardHeader className="flex p-7">
        <CardTitle className="text-2xl font-bold">
          Create Organization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter organization name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What's this organization about?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Create Organization
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
```

---

## Workspace Integration

### Update Workspace Schema

```typescript
// src/features/workspaces/schemas.ts
export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  organizationId: z.string().optional(), // Add this field
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
```

### Update Workspace Route

```typescript
// In workspace creation handler
const workspace = await databases.createDocument(
  DATABASE_ID,
  WORKSPACES_ID,
  ID.unique(),
  {
    name,
    userId: user.$id,
    organizationId: organizationId || null, // Add this
    imageUrl: uploadedImageUrl,
  }
);
```

---

## UI Integration

### Navigation Updates

```typescript
// Add to sidebar structure
{
  title: "Organizations",
  items: [
    { title: "My Organizations", url: "/organizations" },
    { title: "Create Organization", url: "/organizations/create" },
  ]
}
```

### Organization Switcher Component

Similar to workspace switcher but for organizations.

---

## Permission System

### Role Hierarchy

- **OWNER**: Full control (delete organization, manage all members)
- **ADMIN**: Invite/remove members, manage organization settings
- **MEMBER**: View organization, access shared workspaces

### Permission Helper Functions

```typescript
// src/lib/permissions.ts
export const canInviteMembers = (role: MemberRole) => {
  return ["OWNER", "ADMIN"].includes(role);
};

export const canManageOrganization = (role: MemberRole) => {
  return role === "OWNER";
};
```

---

## API Route Registration

### src/app/api/[[...route]]/route.ts

```typescript
import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/features/auth/server/route";
import workspaces from "@/features/workspaces/server/route";
import organizations from "@/features/organizations/server/route"; // Add this

const app = new Hono().basePath("/api");

const routes = app
  .route("/auth", auth)
  .route("/workspaces", workspaces)
  .route("/organizations", organizations); // Add this

export const GET = handle(routes);
export const POST = handle(routes);
export const PUT = handle(routes);
export const DELETE = handle(routes);
export const PATCH = handle(routes);

export type AppType = typeof routes;
```

---

## Implementation Strategy

### Phase 1: Core Organization CRUD

1. Set up database collections in Appwrite
2. Create organization feature structure
3. Implement basic create/read/update/delete operations
4. Add organization switcher to UI

### Phase 2: Member Management

1. Implement invitation system
2. Add member management UI
3. Set up permission checks
4. Test invitation flow

### Phase 3: Workspace Integration

1. Add `organizationId` to workspace schema
2. Update workspace creation to support organization context
3. Implement organization workspace filtering
4. Update workspace permissions

### Phase 4: Polish & Optimization

1. Add email notifications for invitations
2. Implement role-based UI components
3. Add organization settings page
4. Performance optimizations

---

## Key Principles

- **Incremental**: Build on existing patterns, don't break current functionality
- **Simple**: Follow KISS principle, avoid over-engineering
- **Consistent**: Use same patterns as workspace implementation
- **Optional**: Organizations are additive, personal workspaces remain unchanged

---

## Testing Considerations

- Test personal workspace isolation
- Verify organization member permissions
- Test invitation flow for existing/new users
- Validate workspace visibility based on organization membership

---

**Ready for implementation when workspace core functionality is complete! 🚀**
