"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Workspace } from "../types";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const { mutate, isPending } = useUpdateWorkspace();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });
  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none bg-accent">
      <CardHeader className="flex p-7">
        <CardTitle className="text-2xl font-bold">
          {initialValues.name}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <Separator />
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Workspace Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="relative p-2">
                            <div className="relative size-[72px] rounded-md overflow-hidden">
                              <Image
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                                alt="Logo"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                              className="absolute -top-0 -right-0 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded-full p-1 size-6 flex items-center justify-center"
                            >
                              <X className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="relative size-[72px] rounded-md border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex items-center justify-center"
                          >
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-[36px] text-muted-foreground" />
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        )}
                        <div className="flex flex-col gap-y-1">
                          <FormLabel>Workspace Logo</FormLabel>
                          <FormDescription>
                            JPG, PNG, SVG or GIF (max. 1MB)
                          </FormDescription>
                          <Button
                            type="button"
                            className="w-fit"
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={isPending}
                          >
                            {field.value ? "Change Image" : "Upload Image"}
                          </Button>
                        </div>
                      </div>

                      <Input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1024 * 1024) {
                              // 1MB limit
                              toast.error("Image must be less than 1MB");
                              return;
                            }
                            field.onChange(file);
                          }
                        }}
                      />
                    </div>
                  )}
                />
                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn(!onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    Update Workspace
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </div>
    </Card>
  );
};
