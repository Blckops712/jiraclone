"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ClientWrapper = () => {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Ensure we always respect system preference by clearing any stored override
    localStorage.removeItem("theme");
    setTheme("system");
  }, [setTheme]);

  if (!mounted) {
    return <div className="bg-background text-foreground min-h-screen" />;
  }
};
