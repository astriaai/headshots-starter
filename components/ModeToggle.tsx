"use client";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import { Icon } from "@radix-ui/react-select";
const ModeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <>
      {currentTheme === "dark" ? (
        <Button variant="ghost" onClick={() => setTheme("light")}>
          <Sun />
        </Button>
      ) : (
        <Button variant="ghost" onClick={() => setTheme("dark")}>
          <Moon />
        </Button>
      )}
    </>
  );
};

export default ModeToggle;
