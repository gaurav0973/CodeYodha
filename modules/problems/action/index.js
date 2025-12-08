"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getJudge0LanguageId,
  submitBatchToJudge0,
  pollAndGetBatchResultsFromJudge0,
} from "@/lib/judge0";

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

export const runCode = async ({ code, language, testCases }) => {
  try {
    const languageId = getJudge0LanguageId(language);
    if (!languageId) {
      throw new Error("Unsupported language");
    }

    // Ensure testCases is an array
    const cases = Array.isArray(testCases) ? testCases : [];
    if (cases.length === 0) {
      throw new Error("No test cases provided");
    }

    // Prepare submissions for each test case
    const submissions = cases.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output,
    }));

    // Submit to Judge0
    const submissionResponse = await submitBatchToJudge0(submissions);

    // Extract tokens
    const tokens = submissionResponse.map((s) => s.token);

    // Poll for results
    const results = await pollAndGetBatchResultsFromJudge0(tokens);

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error("Error in runCode:", error);
    return {
      success: false,
      error: error.message || "Failed to run code",
    };
  }
};
