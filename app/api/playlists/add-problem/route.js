import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });
    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { problemId, playlistId } = await request.json();
    if (!problemId || !playlistId) {
      return NextResponse.json(
        {
          success: false,
          error: "problemId and playlistId are required",
        },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId: dbUser.id,
      },
    });
    if (!playlist) {
      return NextResponse.json(
        {
          success: false,
          error: "Playlist not found",
        },
        { status: 404 }
      );
    }

    const existingEntry = await prisma.problemInPlaylist.findUnique({
      where: {
        playlistId_problemId: {
          playlistId: playlist.id,
          problemId: problemId,
        },
      },
    });

    if (existingEntry) {
      await prisma.problemInPlaylist.delete({
        where: {
          id: existingEntry.id,
        },
      });
      return NextResponse.json({
        success: true,
        action: "removed",
        message: "Problem removed from playlist",
      });
    }

    const problemInPlaylist = await prisma.problemInPlaylist.create({
      data: {
        playlistId: playlist.id,
        problemId: problemId,
      },
    });

    return NextResponse.json({
      success: true,
      action: "added",
      data: problemInPlaylist,
      message: "Problem added to playlist",
    });

    return NextResponse.json({
      success: true,
      data: problemInPlaylist,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch playlists",
      },
      { status: 500 }
    );
  }
}
