"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Circle,
  ArrowRight,
  MoreHorizontal,
  Share2,
  Code2,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import AddToPlaylist from "@/modules/playlist/components/addToPlaylist";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProblemById } from "@/modules/problems/action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProblemsTable({ problems = [], user }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  const isAdmin = user?.role === "ADMIN";

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      problem.tags.some(
        (tag) => tag.toLowerCase() === searchQuery.toLowerCase().trim()
      );

    const matchesDifficulty =
      difficultyFilter === "ALL" || problem.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "HARD":
        return "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleShare = (problemId) => {
    const url = `${window.location.origin}/problem/${problemId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link Copied!", {
      description: "Problem link has been copied to your clipboard.",
    });
  };

  const handleRowClick = (problemId) => {
    router.push(`/problem/${problemId}`);
  };

  const handleDeleteClick = (problemId) => {
    setProblemToDelete(problemId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;

    const result = await deleteProblemById(problemToDelete);
    if (result.success) {
      toast.success("Problem deleted successfully.");
      setDeleteDialogOpen(false);
      setProblemToDelete(null);
      router.refresh();
    } else {
      toast.error(`Failed to delete problem: ${result.error}`);
    }
  };

  return (
    <div className="space-y-4">
      {/* --- Filter Bar --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search problems by title or tag..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Difficulties</SelectItem>
              <SelectItem value="EASY" className="text-green-600">
                Easy
              </SelectItem>
              <SelectItem value="MEDIUM" className="text-yellow-600">
                Medium
              </SelectItem>
              <SelectItem value="HARD" className="text-red-600">
                Hard
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Data Table --- */}
      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <TableRow
                  key={problem.id}
                  className="group hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(problem.id)}
                >
                  {/* Status Column */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {problem.solvedBy && problem.solvedBy.length > 0 ? (
                      <CheckCircle2
                        className="h-4 w-4 text-green-500"
                        title="Solved"
                      />
                    ) : (
                      <Circle
                        className="h-4 w-4 text-gray-400"
                        title="Unsolved"
                      />
                    )}
                  </TableCell>

                  {/* Title Column */}
                  <TableCell className="font-medium">
                    <Link
                      href={`/problem/${problem.id}`}
                      className="hover:text-orange-600 hover:underline flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {problem.title}
                    </Link>
                  </TableCell>

                  {/* Difficulty Column */}
                  <TableCell>
                    <Badge
                      className={`${getDifficultyColor(problem.difficulty)} border-none`}
                    >
                      {problem.difficulty}
                    </Badge>
                  </TableCell>

                  {/* Tags Column */}
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {problem.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs font-normal text-muted-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {problem.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground self-center">
                          +{problem.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-end items-center gap-2">
                      <div onClick={(e) => e.stopPropagation()}>
                        <AddToPlaylist problemId={problem.id} />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hidden sm:flex"
                        asChild
                      >
                        <Link href={`/problem/${problem.id}`}>
                          Solve <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleShare(problem.id)}
                          >
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/problem/${problem.id}`)
                            }
                          >
                            <Code2 className="mr-2 h-4 w-4" /> View Problem
                          </DropdownMenuItem>
                          {isAdmin && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(problem.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Empty State
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>No problems found matching your criteria.</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("");
                        setDifficultyFilter("ALL");
                      }}
                      className="text-orange-600"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Showing {filteredProblems.length} of {problems.length} problems
      </div>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              problem and remove all associated data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProblemToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
