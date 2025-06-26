"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { deleteWorkspaceSchema } from "../schemas";
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
import { Button } from "@/components/ui/button";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { Workspace } from "../types";
import { useRouter } from "next/navigation";

interface DeleteWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const DeleteWorkspaceForm = ({
  onCancel,
  initialValues,
}: DeleteWorkspaceFormProps) => {
  const { mutate, isPending } = useDeleteWorkspace();
  const router = useRouter();

  const form = useForm<z.infer<typeof deleteWorkspaceSchema>>({
    resolver: zodResolver(
      deleteWorkspaceSchema.refine(
        (data) => data.workspaceName === initialValues.name,
        {
          message: "Workspace name does not match",
          path: ["workspaceName"],
        }
      )
    ),
    defaultValues: {
      workspaceName: "",
    },
  });

  const onSubmit = () => {
    mutate(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none bg-accent">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold text-destructive">
          Delete Workspace
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. This will permanently delete the{" "}
          <strong>{initialValues.name}</strong> workspace and remove all
          associated data.
        </p>
      </CardHeader>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workspaceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <strong>{initialValues.name}</strong> to confirm:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={initialValues.name}
                      disabled={isPending}
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
              <Button type="submit" variant="destructive" disabled={isPending}>
                Delete Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
