"use client";

import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ProblemHeader from "./ProblemHeader";
import ProblemDescription from "./ProblemDescription";
import CodeEditor from "./CodeEditor";
import Console from "./Console";
import { runCode, submitCode } from "@/modules/problems/action";
import { toast } from "sonner";

export default function ProblemWorkspace({ problem }) {
  const [language, setLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState(() => {
    const snippets = problem.codeSnippets || {};
    const key = Object.keys(snippets).find(
      (k) => k.toUpperCase() === "JAVASCRIPT"
    );
    return key ? snippets[key] : "";
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submissionCount, setSubmissionCount] = useState(0);

  const handleRun = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const result = await runCode({
        code,
        language,
        testCases: problem.testCases,
      });

      if (result.success) {
        setRunResult(result.data);
        toast.success("Code executed successfully");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setRunResult(null);
    try {
      const result = await submitCode({
        code,
        language,
        problemId: problem.id,
      });

      if (result.success) {
        setRunResult(result.data);
        setSubmissionCount((prev) => prev + 1);
        if (result.isAccepted) {
          toast.success("Accepted! All test cases passed.");
        } else {
          toast.error("Wrong Answer. Some test cases failed.");
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <ProblemHeader />

      <div className="flex-1 overflow-hidden p-2">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Left Panel: Description */}
          <ResizablePanel
            defaultSize={40}
            minSize={25}
            maxSize={75}
            className="mr-1"
          >
            <ProblemDescription
              problem={problem}
              submissionCount={submissionCount}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-transparent w-1" />

          {/* Right Panel: Editor & Console */}
          <ResizablePanel defaultSize={60} minSize={25} className="ml-1">
            <ResizablePanelGroup direction="vertical">
              {/* Top: Code Editor */}
              <ResizablePanel defaultSize={60} minSize={25} className="mb-1">
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  language={language}
                  setLanguage={setLanguage}
                  codeSnippets={problem.codeSnippets}
                />
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-transparent h-1" />

              {/* Bottom: Console */}
              <ResizablePanel defaultSize={40} minSize={10} className="mt-1">
                <Console
                  testCases={problem.testCases}
                  onRun={handleRun}
                  onSubmit={handleSubmit}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  runResult={runResult}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
