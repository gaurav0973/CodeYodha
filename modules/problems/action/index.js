"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const getAllProblems = async () => {
  try {
    const user = await currentUser();
    let userId = null;

    // Only fetch user data if user is authenticated
    if (user?.id) {
      const data = await prisma.user.findUnique({
        where: {
          clerkId: user.id,
        },
        select: {
          id: true,
        },
      });
      userId = data?.id;
    }

    const problems = await prisma.problem.findMany({
      include: {
        solvedBy: userId
          ? {
              where: {
                userId: userId,
              },
            }
          : false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      success: true,
      data: problems,
      message: "Problems fetched successfully",
    };
  } catch (error) {
    console.error("Error in getAllProblems:", error);
    return {
      success: false,
      error: error.message || "Failed to fetch problems",
    };
  }
};

export const getProblemById = async (id) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        id: id,
      },
    });
    return {
      success: true,
      data: problem,
      message: "Problem fetched successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch problem",
    };
  }
};

export const deleteProblemById = async (problemId) => {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }
    await prisma.problem.delete({
      where: {
        id: problemId,
      },
    });
    revalidatePath("/problems");
    return {
      success: true,
      message: "Problem deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to delete problem",
    };
  }
};
