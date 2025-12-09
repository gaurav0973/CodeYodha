"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, List, Settings, User } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import AddToPlaylist from "@/modules/playlist/components/addToPlaylist";

export default function ProblemHeader({ problemId }) {
  return (
    <div className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold shadow-lg shadow-orange-500/20">
            CY
          </div>
        </Link>

        <div className="h-6 w-px bg-border mx-2" />

        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/problems">
            <List className="w-4 h-4" /> Problem List
          </Link>
        </Button>

        <AddToPlaylist problemId={problemId} />

        <Button variant="ghost" size="icon" disabled>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled>
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="gap-2 rounded-full px-6 font-medium hover:bg-muted-foreground/10"
        >
          Run
        </Button>
        <Button
          size="sm"
          className="gap-2 rounded-full px-6 font-medium bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/20"
        >
          Submit
        </Button>
        <div className="h-6 w-px bg-border mx-2" />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-4 h-4" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
          <User className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
