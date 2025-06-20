"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "../api/use-logout";
import { useCurrent } from "../api/use-current";
import { Loader2, LogOut } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";

export const UserButton = () => {
  const { data: user, isLoading } = useCurrent();
  const { mutate: logout } = useLogout();
  if (isLoading) {
    return (
      <div className="size-10 animate-pulse rounded-full bg-muted flex items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }
  const { name, email } = user;

  const avatarFallback = name
    ? name.charAt(0).toUpperCase()
    : email?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-80 transition border border-neutral-200 dark:border-neutral-800">
          <AvatarFallback className="bg-neutral-100 dark:bg-neutral-900 font-medium text-neutral-900 dark:text-neutral-100 items-center justify-center">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="bottom"
        sideOffset={10}
        className="w-60"
      >
        <div className="flex flex-col items-center justify-center gap-2 px-2.5 py-2">
          <Avatar className="size-10 hover:opacity-80 transition border border-neutral-200 dark:border-neutral-800">
            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-900 font-medium text-neutral-900 dark:text-neutral-100 items-center justify-center">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <DottedSeparator className="mb-1" />
        <div className="flex items-center justify-center flex-col gap-2">
          <DropdownMenuItem
            className="flex items-center h-10 w-full justify-center font-medium text-amber-500 cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut className="size-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
