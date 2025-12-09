"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, ListPlus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";

export default function AddToPlaylist({ problemId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchPlaylists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/playlists");
      if (res.data.success) {
        // Check if problem is in playlist
        const playlistsWithStatus = res.data.playlists.map((p) => ({
          ...p,
          containsProblem: p.problems.some(
            (item) => item.problem.id === problemId
          ),
        }));
        setPlaylists(playlistsWithStatus);
      }
    } catch (error) {
      toast.error("Failed to load playlists");
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen, fetchPlaylists]);

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setCreating(true);
    try {
      const res = await axios.post("/api/playlists", {
        name: newPlaylistName,
      });
      if (res.data.success) {
        toast.success("Playlist created");
        setNewPlaylistName("");
        fetchPlaylists(); // Refresh list
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create playlist");
    } finally {
      setCreating(false);
    }
  };

  const togglePlaylist = async (playlistId, isSelected) => {
    // Optimistic update
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, containsProblem: !isSelected } : p
      )
    );

    try {
      const res = await axios.post("/api/playlists/add-problem", {
        playlistId,
        problemId,
      });

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      // Revert on failure
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId ? { ...p, containsProblem: isSelected } : p
        )
      );
      toast.error(error.response?.data?.error || "Failed to update playlist");
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <ListPlus className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium leading-none mb-2">Add to Playlist</h4>
          <p className="text-xs text-muted-foreground">
            Save this problem to a custom list.
          </p>
        </div>

        <ScrollArea className="h-[200px] p-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No playlists found.
            </div>
          ) : (
            <div className="space-y-1">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                  onClick={() =>
                    togglePlaylist(playlist.id, playlist.containsProblem)
                  }
                >
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded border ${playlist.containsProblem ? "bg-primary border-primary text-primary-foreground" : "border-primary"}`}
                  >
                    {playlist.containsProblem && <Check className="h-3 w-3" />}
                  </div>
                  <span className="text-sm font-medium">{playlist.name}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-2 border-t bg-muted/30">
          <form onSubmit={handleCreatePlaylist} className="flex gap-2">
            <Input
              placeholder="New playlist..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="h-8 text-xs"
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 px-2"
              disabled={creating || !newPlaylistName.trim()}
            >
              {creating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
