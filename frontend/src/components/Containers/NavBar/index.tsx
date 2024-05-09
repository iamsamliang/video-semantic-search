"use client";

import ThemeToggler from "@/components/Themes/ThemeToggler";
import { useTheme } from "next-themes";

export default function NavBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleCurrentTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <nav className="border-neutral-200 dark:border-neutral-800 flex h-16 items-center justify-between border-b px-8">
      <div className="text-xl">Vid Scour</div>
      <div className="flex">
        <ThemeToggler onClick={toggleCurrentTheme} />
      </div>
    </nav>
  );
}
