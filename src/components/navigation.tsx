import { SettingsIcon, UsersIcon } from "lucide-react";
import { GoChecklist, GoHome } from "react-icons/go";
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHome,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoChecklist,
    activeIcon: GoChecklist,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

export const Navigation = () => {
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = false;
        const Icon = isActive ? item.activeIcon : item.icon;
        return (
          <Link key={item.label} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary",
                isActive && "bg-primary/10 text-primary hover:opacity-100 "
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
