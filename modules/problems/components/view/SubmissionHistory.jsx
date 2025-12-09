"use client";

import React, { useEffect, useState } from "react";
import { getAllSubmissionByUserForCurrentProblem } from "@/modules/problems/action";
import { formatDistanceToNow } from "date-fns";
import { Loader2, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SubmissionHistory({ problemId, submissionCount }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const result = await getAllSubmissionByUserForCurrentProblem(problemId);
        if (result.success) {
          setSubmissions(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId, submissionCount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
        <p>No submissions yet.</p>
        <p>Run your code and submit to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Runtime</TableHead>
            <TableHead>Memory</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const isAccepted = submission.status === "Accepted";
            return (
              <TableRow key={submission.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`font-medium ${
                        isAccepted ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {submission.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {submission.language}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {submission.time
                      ? `${(parseFloat(submission.time) * 1000).toFixed(0)} ms`
                      : "N/A"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Zap className="w-3 h-3" />
                    {submission.memory ? `${submission.memory} KB` : "N/A"}
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(submission.createdAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
