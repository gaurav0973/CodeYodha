"use server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  getJudge0LanguageId,
  submitBatchToJudge0,
  pollAndGetBatchResultsFromJudge0,
} from "@/lib/judge0";
import { use } from "react";
import { NextResponse } from "next/server";

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
    const user = await currentUser();
    let userId = null;
    if (user?.id) {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id },
        select: { id: true },
      });
      userId = dbUser?.id;
    }

    const problem = await prisma.problem.findUnique({
      where: {
        id: id,
      },
      include: {
        solvedBy: userId
          ? {
              where: {
                userId: userId,
              },
            }
          : false,
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

    const cases = Array.isArray(testCases) ? testCases : [];
    if (cases.length === 0) {
      throw new Error("No test cases provided");
    }

    const submissions = cases.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output,
    }));

    const submissionResponse = await submitBatchToJudge0(submissions);
    const tokens = submissionResponse.map((s) => s.token);
    const results = await pollAndGetBatchResultsFromJudge0(tokens);

    const detailedResults = results.map((res, index) => {
      return {
        testCase: index + 1,
        passed: res.status.id === 3,
        status: res.status.description,
        stdout: res.stdout,
        stderr: res.stderr,
        compile_output: res.compile_output,
        expected: cases[index].output,
        time: res.time,
        memory: res.memory,
      };
    });

    return {
      success: true,
      data: detailedResults,
    };
  } catch (error) {
    console.error("Error in runCode:", error);
    return {
      success: false,
      error: error.message || "Failed to run code",
    };
  }
};

export const submitCode = async ({ code, language, problemId }) => {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return { success: false, error: "User not found in database" };
    }

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return { success: false, error: "Problem not found" };
    }

    const languageId = getJudge0LanguageId(language);
    if (!languageId) {
      return { success: false, error: "Unsupported language" };
    }

    const testCases = problem.testCases;
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return { success: false, error: "No test cases found for this problem" };
    }

    // Prepare submissions
    const submissions = testCases.map((tc) => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
      expected_output: tc.output,
    }));

    // Submit to Judge0
    const submissionResponse = await submitBatchToJudge0(submissions);
    const tokens = submissionResponse.map((s) => s.token);
    const results = await pollAndGetBatchResultsFromJudge0(tokens);

    // Analyze results
    let allPassed = true;
    const detailedResults = results.map((res, index) => {
      const isAccepted = res.status.id === 3;
      if (!isAccepted) allPassed = false;
      return {
        testCase: index + 1,
        passed: isAccepted,
        status: res.status.description,
        stdout: res.stdout,
        stderr: res.stderr,
        compile_output: res.compile_output,
        expected: testCases[index].output,
        time: res.time,
        memory: res.memory,
      };
    });

    // Create Submission Record
    const submission = await prisma.submission.create({
      data: {
        userId: dbUser.id,
        problemId: problemId,
        sourceCode: code,
        language: language,
        status: allPassed ? "Accepted" : "Wrong Answer",
      },
    });

    // Create TestCaseResult Records
    await prisma.testCaseResult.createMany({
      data: detailedResults.map((res) => ({
        submissionId: submission.id,
        testCase: res.testCase,
        passed: res.passed,
        stdout: res.stdout,
        stderr: res.stderr,
        compiledOutput: res.compile_output,
        expected: res.expected,
        status: res.status,
      })),
    });

    // Update ProblemSolved if passed
    if (allPassed) {
      await prisma.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId: dbUser.id,
            problemId: problemId,
          },
        },
        create: {
          userId: dbUser.id,
          problemId: problemId,
        },
        update: {},
      });
    }

    revalidatePath("/problems");
    revalidatePath(`/problem/${problemId}`);

    return {
      success: true,
      data: detailedResults,
      isAccepted: allPassed,
      message: allPassed ? "All Test Cases Passed!" : "Some Test Cases Failed",
    };
  } catch (error) {
    console.error("Error in submitCode:", error);
    return { success: false, error: error.message || "Failed to submit code" };
  }
};
