"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onBoardUserToDatabase = async () => {
  try {
    const user = await currentUser();
    // console.log("Authenticated User:", user);

    if (!user) {
      return {
        success: false,
        error: "No authenticated user found",
      };
    }

    const { id, emailAddresses, firstName, lastName, imageUrl } = user;
    // console.log("User Details:", { id, emailAddresses, firstName, lastName, imageUrl });

    const email = emailAddresses?.[0]?.emailAddress ?? "";

    const newUser = await prisma.user.upsert({
      where: { clerkId: id },
      create: {
        clerkId: id,
        email,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        imageUrl: imageUrl ?? null,
      },
      update: {
        email,
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        imageUrl: imageUrl ?? null,
      },
    });

    return {
      success: true,
      user: newUser,
      message: "User on-boarded successfully",
    };
  } catch (error) {
    // console.error("Error while on-boarding user:", error);
    return {
      success: false,
      error: "Failed to on-board user to database",
    };
  }
};


export const getCurrentUserRole = async () => {
    try {
        const user = await currentUser()
        if (!user) {
            return {
                success: false,
                error: "No authenticated user found"
            }
        }
        const {id} = user
        const userRole = await prisma.user.findUnique({
            where: {clerkId: id},
            select: {role: true}
        })
        return userRole?.role || null
    } catch (error) {
        return {
            success: false,
            error: "Failed to fetch user role"
        }
    }
}
