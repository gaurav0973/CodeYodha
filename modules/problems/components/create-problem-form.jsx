"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Editor from "@monaco-editor/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Trash2,
  Plus,
  Save,
  Code2,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";

// --- 1. Sample Data (The "Climbing Stairs" Example) ---
const sampledpData = {
  title: "Climbing Stairs",
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"], // Array here, but form expects string
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial: "This is a classic dynamic programming problem...",
  examples: [
    {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top.\n1. 1 step + 1 step\n2. 2 steps",
    },
    {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top.\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
  ],
  testCases: [
    { input: "2", output: "2" },
    { input: "3", output: "3" },
    { input: "4", output: "5" },
  ],
  codeSnippets: {
    JAVASCRIPT: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\n\n/**\n * @param {number} n\n * @return {number}\n */\nfunction climbStairs(n) {\n  // Write your code here\n}\n\n// Main execution\nconst n = parseInt(input);\nconsole.log(climbStairs(n));`,
    PYTHON: `import sys\n\nclass Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your code here\n        pass\n\nif __name__ == "__main__":\n    input = sys.stdin.read().strip()\n    n = int(input)\n    solution = Solution()\n    print(solution.climbStairs(n))`,
    JAVA: `import java.util.Scanner;\n\nclass Solution {\n    public int climbStairs(int n) {\n        // Write your code here\n        return 0;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int n = scanner.nextInt();\n        Solution solution = new Solution();\n        System.out.println(solution.climbStairs(n));\n        scanner.close();\n    }\n}`,
  },
  referenceSolution: {
    JAVASCRIPT: `function climbStairs(n) {
  if (n <= 2) return n;
  let dp = [0, 1, 2];
  for(let i=3; i<=n; i++) dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}

// Read from stdin and write to stdout
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
const n = parseInt(input);
console.log(climbStairs(n));`,
    PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2: return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b

# Read from stdin and write to stdout
if __name__ == "__main__":
    n = int(input().strip())
    solution = Solution()
    print(solution.climbStairs(n))`,
    JAVA: `import java.util.Scanner;

class Solution {
    public int climbStairs(int n) {
        if(n <= 2) return n;
        int a=1, b=2;
        for(int i=3; i<=n; i++) {
            int temp = a+b;
            a=b; b=temp;
        }
        return b;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        Solution solution = new Solution();
        System.out.println(solution.climbStairs(n));
        scanner.close();
    }
}`,
  },
};

// --- 2. Zod Schema ---
const problemSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.string().min(1, "Tags are required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),

  examples: z
    .array(
      z.object({
        input: z.string().min(1, "Input required"),
        output: z.string().min(1, "Output required"),
        explanation: z.string().optional(),
      })
    )
    .min(1, "At least one example is required"),

  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input required"),
        output: z.string().min(1, "Output required"),
      })
    )
    .min(1, "At least one test case is required"),

  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JS Snippet required"),
    PYTHON: z.string().min(1, "Python Snippet required"),
    JAVA: z.string().min(1, "Java Snippet required"),
  }),
  referenceSolution: z.object({
    JAVASCRIPT: z.string().min(1, "JS Solution required"),
    PYTHON: z.string().min(1, "Python Solution required"),
    JAVA: z.string().min(1, "Java Solution required"),
  }),
});

// --- 3. Editor Component ---
const CodeEditor = ({ value, onChange, language }) => {
  return (
    <div className="border rounded-md overflow-hidden h-[300px] w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage={language.toLowerCase()}
        language={language.toLowerCase()}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

// --- 4. Main Form ---
export default function CreateProblemForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeLang, setActiveLang] = useState("JAVASCRIPT");

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: "",
      constraints: "",
      hints: "",
      editorial: "",
      examples: [{ input: "", output: "", explanation: "" }],
      testCases: [{ input: "", output: "" }],
      codeSnippets: { JAVASCRIPT: "", PYTHON: "", JAVA: "" },
      referenceSolution: { JAVASCRIPT: "", PYTHON: "", JAVA: "" },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testCases",
  });

  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control: form.control,
    name: "examples",
  });

  // --- Logic to Load Sample Data ---
  const handleLoadSample = () => {
    // We must transform the tags array ["DP", "Math"] -> "DP, Math" string
    const formattedData = {
      ...sampledpData,
      tags: sampledpData.tags.join(", "),
    };
    form.reset(formattedData);
  };

  async function onSubmit(data) {
    setIsLoading(true); // Start loading

    try {
      // 1. Format the data
      const formattedData = {
        ...data,
        tags: data.tags.split(",").map((t) => t.trim()),
        difficulty: data.difficulty.toUpperCase(),
      };

      // 2. Make the API Request
      const response = await axios.post("/api/create-problem", formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 3. Handle Errors
      if (response.status < 200 || response.status >= 300) {
        const errorData = response.data;
        throw new Error(errorData?.error || "Failed to create problem");
      }

      // 4. Success Actions
      const result = response.data;
      console.log("Success:", result);

      toast.success("Problem Created Successfully!");

      // --- RESET LOGIC STARTS HERE ---

      // A. Reset the form to initial default values
      form.reset({
        title: "",
        description: "",
        difficulty: "EASY",
        tags: "",
        constraints: "",
        hints: "",
        editorial: "",
        examples: [{ input: "", output: "", explanation: "" }],
        testCases: [{ input: "", output: "" }],
        codeSnippets: { JAVASCRIPT: "", PYTHON: "", JAVA: "" },
        referenceSolution: { JAVASCRIPT: "", PYTHON: "", JAVA: "" },
      });

      // B. Reset local state (set tab back to default)
      setActiveLang("JAVASCRIPT");

      // C. Scroll to the top of the page to simulate a fresh load
      window.scrollTo({ top: 0, behavior: "smooth" });

      router.push("/problems");

      // --- RESET LOGIC ENDS HERE ---
    } catch (error) {
      console.error("Submission Error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "Server error";
        toast.error(`Error: ${errorMessage}`);
      } else if (error.request) {
        toast.error("Network error - please check your connection");
      } else {
        toast.error(error.message || "Unknown error occurred");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  }

  return (
    <div className="w-full bg-card border rounded-lg shadow-sm p-6">
      {/* Header with Load Sample Button */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Create New Problem
          </h2>
          <p className="text-muted-foreground mt-1">
            Fill in the details below to add a challenge to CodeYodha.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleLoadSample}
            disabled={isLoading}
          >
            <FlaskConical className="w-4 h-4 mr-2" /> Load Sample
          </Button>

          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-orange-600 hover:bg-orange-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Publish
              </>
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="testcases">Test Cases</TabsTrigger>
              <TabsTrigger value="code">Language & Code</TabsTrigger>
            </TabsList>

            {/* TAB 1: GENERAL */}
            <TabsContent value="general" className="space-y-6">
              {/* Title & Difficulty Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Two Sum" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="EASY" className="text-green-600">
                              Easy
                            </SelectItem>
                            <SelectItem
                              value="MEDIUM"
                              className="text-yellow-600"
                            >
                              Medium
                            </SelectItem>
                            <SelectItem value="HARD" className="text-red-600">
                              Hard
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Array, Hash Table" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Markdown)</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Constraints & Hints Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="constraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Constraints</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-32 font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hints (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-32"
                          placeholder="Helpful tips..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* TAB 2: EXAMPLES */}
            <TabsContent value="examples" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Examples</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    appendExample({ input: "", output: "", explanation: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Example
                </Button>
              </div>

              {exampleFields.map((field, index) => (
                <Card key={field.id} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                    onClick={() => removeExample(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`examples.${index}.input`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase text-muted-foreground font-bold">
                              Input {index + 1}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="font-mono text-sm bg-muted/50"
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`examples.${index}.output`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase text-muted-foreground font-bold">
                              Output {index + 1}
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                className="font-mono text-sm bg-muted/50"
                                rows={2}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`examples.${index}.explanation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase text-muted-foreground font-bold">
                            Explanation {index + 1} (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="font-mono text-sm bg-muted/50"
                              rows={2}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* TAB 3: TEST CASES */}
            <TabsContent value="testcases" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Test Cases</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ input: "", output: "" })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Case
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id} className="relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-muted-foreground hover:text-red-500"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`testCases.${index}.input`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase text-muted-foreground font-bold">
                            Input {index + 1}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="font-mono text-sm bg-muted/50"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testCases.${index}.output`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase text-muted-foreground font-bold">
                            Output {index + 1}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="font-mono text-sm bg-muted/50"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* TAB 3: CODE */}
            <TabsContent value="code">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Language Sidebar */}
                <div className="w-full md:w-48 flex md:flex-col gap-2">
                  {["JAVASCRIPT", "PYTHON", "JAVA"].map((lang) => (
                    <Button
                      key={lang}
                      type="button"
                      variant={activeLang === lang ? "default" : "secondary"}
                      className={`justify-start ${activeLang === lang ? "bg-blue-600 text-white hover:bg-blue-700" : ""}`}
                      onClick={() => setActiveLang(lang)}
                    >
                      {lang === "JAVASCRIPT" && "JavaScript"}
                      {lang === "PYTHON" && "Python"}
                      {lang === "JAVA" && "Java"}
                    </Button>
                  ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1 space-y-6">
                  <FormField
                    control={form.control}
                    name={`codeSnippets.${activeLang}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Code2 className="w-4 h-4" /> Starter Code (
                          {activeLang})
                        </FormLabel>
                        <FormControl>
                          <CodeEditor
                            language={activeLang}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`referenceSolution.${activeLang}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-4 h-4" /> Reference
                          Solution ({activeLang})
                        </FormLabel>
                        <FormControl>
                          <CodeEditor
                            language={activeLang}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
