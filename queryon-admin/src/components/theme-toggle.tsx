"use client";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { CommonDropdown } from "@/shared/elements";

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <CommonDropdown
      size="sm"
      variant="ghost"
      items={[
        {
          label: "Light",
          icon: Sun,
          onClick: () => setTheme("light"),
        },
        {
          label: "Dark",
          icon: Moon,
          onClick: () => setTheme("dark"),
        },
        {
          label: "System",
          icon: Monitor,
          onClick: () => setTheme("system"),
        },
      ]}
    />
  );
};

export default ThemeToggle;
