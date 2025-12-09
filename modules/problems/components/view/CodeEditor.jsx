"use client";

import React from "react";
import { Editor } from "@monaco-editor/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, RefreshCw } from "lucide-react";

export default function CodeEditor({
  code,
  onChange,
  language,
  setLanguage,
  theme = "vs-dark",
  codeSnippets = {},
}) {
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (codeSnippets) {
      const snippetKey = Object.keys(codeSnippets).find(
        (key) => key.toUpperCase() === newLang.toUpperCase()
      );
      if (snippetKey) {
        onChange(codeSnippets[snippetKey]);
      } else {
        onChange("");
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] rounded-xl overflow-hidden border shadow-sm">
      {/* Editor Header */}
      <div className="h-11 flex items-center justify-between px-4 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-8 w-[140px] text-xs bg-transparent border-none focus:ring-0 focus:ring-offset-0 font-medium text-muted-foreground hover:text-foreground transition-colors">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
              <SelectItem value="PYTHON">Python</SelectItem>
              <SelectItem value="JAVA">Java</SelectItem>
              <SelectItem value="CPP">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={() => {
              if (codeSnippets) {
                const snippetKey = Object.keys(codeSnippets).find(
                  (key) => key.toUpperCase() === language.toUpperCase()
                );
                onChange(snippetKey ? codeSnippets[snippetKey] : "");
              }
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          language={language.toLowerCase()}
          value={code}
          theme={theme}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'Geist Mono', monospace",
          }}
        />
      </div>
    </div>
  );
}
