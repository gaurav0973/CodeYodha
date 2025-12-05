"use client"
import { useTheme } from "next-themes";
import { Button } from "./button"
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400 cursor-pointer" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800 cursor-pointer" />
      )}
    </Button>
  );
}

export default ModeToggle;
