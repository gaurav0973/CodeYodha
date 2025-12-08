"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
} from "lucide-react";

export default function Console({
  testCases = [],
  onRun,
  onSubmit,
  isRunning,
  isSubmitting,
  runResult,
  submitResult,
}) {
  const [activeTab, setActiveTab] = useState("testcase");

  return (
    <div className="flex flex-col h-full bg-card rounded-xl overflow-hidden border shadow-sm">
      {/* Console Header / Tabs */}
      <div className="flex items-center justify-between px-4 h-11 bg-muted/30 border-b border-border">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="h-full bg-transparent p-0 gap-4">
            <TabsTrigger
              value="testcase"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none rounded-none h-full px-0 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Testcase
            </TabsTrigger>
            <TabsTrigger
              value="result"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none rounded-none h-full px-0 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" /> Test Result
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-7 text-xs gap-2 bg-muted hover:bg-muted/80"
            onClick={() => console.log("Console toggle")}
          >
            Console
          </Button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full">
          <div className="p-4">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="testcase" className="mt-0 space-y-4">
                {testCases.map((testCase, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">
                      Case {index + 1}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Input:
                      </label>
                      <div className="bg-muted/50 p-3 rounded-md text-sm font-mono border">
                        {testCase.input}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Expected Output:
                      </label>
                      <div className="bg-muted/50 p-3 rounded-md text-sm font-mono border">
                        {testCase.output}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="result" className="mt-0">
                {runResult ? (
                  <div className="space-y-6">
                    {runResult.map((res, index) => {
                      const isAccepted = res.status.id === 3; // 3 is Accepted
                      return (
                        <div
                          key={index}
                          className="space-y-3 pb-4 border-b last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`text-sm font-medium ${isAccepted ? "text-green-500" : "text-red-500"}`}
                            >
                              Case {index + 1}: {res.status.description}
                            </div>
                          </div>
                          {!isAccepted && res.compile_output && (
                            <div className="bg-red-500/10 p-3 rounded-md text-xs font-mono text-red-500 border border-red-500/20 whitespace-pre-wrap">
                              {res.compile_output}
                            </div>
                          )}
                          {!isAccepted && res.stderr && (
                            <div className="bg-red-500/10 p-3 rounded-md text-xs font-mono text-red-500 border border-red-500/20 whitespace-pre-wrap">
                              {res.stderr}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">
                                Input:
                              </label>
                              <div className="bg-muted/50 p-2 rounded-md text-xs font-mono border whitespace-pre-wrap">
                                {testCases[index]?.input}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">
                                Your Output:
                              </label>
                              <div
                                className={`${isAccepted ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"} p-2 rounded-md text-xs font-mono border whitespace-pre-wrap`}
                              >
                                {res.stdout || "No output"}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs text-muted-foreground">
                              Expected Output:
                            </label>
                            <div className="bg-muted/50 p-2 rounded-md text-xs font-mono border whitespace-pre-wrap">
                              {testCases[index]?.output}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
                    <p>Run your code to see results here</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>

      {/* Console Footer / Actions */}
      <div className="h-14 border-t border-border bg-card flex items-center justify-between px-4 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Retrieve
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="min-w-[80px] rounded-full font-medium"
            onClick={onRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run
          </Button>
          <Button
            size="sm"
            className="min-w-[80px] bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium shadow-md shadow-orange-500/20"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
