"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  ListTodo,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/features/auth/components/nav-user";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  workspaces: [
    {
      name: "Skullcandy",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Qualatas",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Product",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: SquareTerminal,
    },
    {
      title: "My Tasks",
      url: "/tasks",
      icon: ListTodo,
    },
    {
      title: "Marketing",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Campaigns",
          url: "/marketing/campaigns",
        },
        {
          title: "Analytics",
          url: "/marketing/analytics",
        },
        {
          title: "Reports",
          url: "/marketing/reports",
        },
      ],
    },
    {
      title: "Product",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Workspace",
          url: "/settings",
        },
        {
          title: "Members",
          url: "/members",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();

  const fullHref = (href: string) => {
    if (href === "/" && workspaceId) {
      return `/workspaces/${workspaceId}`;
    }
    if (href.startsWith("/") && workspaceId) {
      return `/workspaces/${workspaceId}${href}`;
    }
    return href;
  };

  const isActiveItem = (itemUrl: string, subItems?: { url: string }[]) => {
    const fullUrl = fullHref(itemUrl);

    // Exact match for current path
    if (pathname === fullUrl) {
      return true;
    }

    // Check if any sub-items match the current path
    if (subItems) {
      return subItems.some((subItem) => {
        const subUrl = fullHref(subItem.url);
        return pathname === subUrl;
      });
    }

    return false;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>WORKSPACES</SidebarGroupLabel>
          <WorkspaceSwitcher />
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain.map((item) => ({
            ...item,
            url: fullHref(item.url),
            isActive: isActiveItem(item.url, item.items),
            items: item.items?.map((subItem) => ({
              ...subItem,
              url: fullHref(subItem.url),
            })),
          }))}
        />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
