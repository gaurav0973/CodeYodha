"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Lightbulb,
  BookOpen,
  History,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function ProblemDescription({ problem }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-transparent";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-transparent";
      case "HARD":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-transparent";
      default:
        return "bg-gray-100 text-gray-700 border-transparent";
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-xl overflow-hidden border shadow-sm">
      <Tabs defaultValue="description" className="flex-1 flex flex-col h-full">
        <div className="border-b px-4 bg-muted/30">
          <TabsList className="h-11 bg-transparent p-0 gap-6">
            <TabsTrigger
              value="description"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none rounded-none h-full px-0 gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-4 h-4" /> Description
            </TabsTrigger>
            <TabsTrigger
              value="editorial"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none rounded-none h-full px-0 gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Editorial
            </TabsTrigger>
            <TabsTrigger
              value="solutions"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none rounded-none h-full px-0 gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Lightbulb className="w-4 h-4" /> Solutions
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 data-[state=active]:shadow-none rounded-none h-full px-0 gap-2 font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <History className="w-4 h-4" /> Submissions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="description"
          className="flex-1 p-0 m-0 h-full overflow-hidden"
        >
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tight">
                  {problem.title}
                </h1>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={`${getDifficultyColor(problem.difficulty)} border`}
                  >
                    {problem.difficulty}
                  </Badge>
                  {problem.solvedBy && problem.solvedBy.length > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-transparent flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Solved
                    </Badge>
                  )}
                  {problem.tags &&
                    problem.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Description Body */}
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-6">
                  <h4 className="text-blue-800 dark:text-blue-300 font-semibold flex items-center gap-2 mb-2 text-sm">
                    <Info className="w-4 h-4" /> Standard I/O Required
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-3">
                    Your code must read the input from <code>stdin</code> and
                    print the output to <code>stdout</code>. Do not just return
                    a value.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-background/50 p-2 rounded border border-blue-200 dark:border-blue-800/50">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                        JavaScript Example:
                      </p>
                      <pre className="text-[10px] font-mono overflow-x-auto">
                        {`const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
// Process input and print result
console.log(result);`}
                      </pre>
                    </div>
                    <div className="bg-background/50 p-2 rounded border border-blue-200 dark:border-blue-800/50">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">
                        Python Example:
                      </p>
                      <pre className="text-[10px] font-mono overflow-x-auto">
                        {`import sys
input = sys.stdin.read().strip()
# Process input and print result
print(result)`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-sans">
                  {problem.description}
                </div>
              </div>

              {/* Examples */}
              {problem.examples && problem.examples.length > 0 ? (
                <div className="space-y-4">
                  {problem.examples.map((example, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="font-semibold text-sm">
                        Example {index + 1}:
                      </h3>
                      <div className="bg-muted/50 rounded-lg p-4 text-sm font-mono space-y-2 border">
                        <div>
                          <span className="font-semibold text-muted-foreground">
                            Input:
                          </span>{" "}
                          {example.input}
                        </div>
                        <div>
                          <span className="font-semibold text-muted-foreground">
                            Output:
                          </span>{" "}
                          {example.output}
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="font-semibold text-muted-foreground">
                              Explanation:
                            </span>{" "}
                            {example.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed text-center text-muted-foreground text-sm">
                  No examples available for this problem.
                </div>
              )}

              {/* Constraints */}
              {problem.constraints && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Constraints:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground font-mono bg-muted/30 p-4 rounded-lg border">
                    {problem.constraints.split("\n").map((constraint, i) => (
                      <li key={i}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="editorial" className="p-6">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Editorial content coming soon...
          </div>
        </TabsContent>

        <TabsContent value="solutions" className="p-6">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Community solutions coming soon...
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="p-6">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Your submissions history...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
