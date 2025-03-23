"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M12 2v1m0 18v1M4 12H3m18 0h-1M6 6l-.7-.7M18 18l.7.7M6 18l-.7.7M18 6l.7-.7M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
          </svg>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light - Clean & Simple
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark - Matte Black
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("royal")}>
          Royal - Luxurious
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("natural")}>
          Natural - Pastel Watercolor
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("buzz")}>
          Buzz - Neon Funky
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 