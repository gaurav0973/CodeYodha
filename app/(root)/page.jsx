import { onBoardUserToDatabase } from "@/modules/auth/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  BrainCircuit, 
  Layers, 
  Lightbulb, 
  Target, 
  TrendingUp 
} from "lucide-react";

export default async function Home() {
  // 1. Keep onboarding logic
  await onBoardUserToDatabase();

  const patterns = [
    { title: "Sliding Window", desc: "Master subarrays and substring problems efficiently.", difficulty: "Medium", count: 24 },
    { title: "Two Pointers", desc: "Optimize searching pairs in sorted arrays.", difficulty: "Easy", count: 18 },
    { title: "Fast & Slow Pointers", desc: "Detect cycles in linked lists and arrays.", difficulty: "Medium", count: 12 },
    { title: "Merge Intervals", desc: "Handle overlapping time intervals effectively.", difficulty: "Medium", count: 15 },
    { title: "Cyclic Sort", desc: "Solve missing/duplicate number problems in O(n).", difficulty: "Hard", count: 10 },
    { title: "Top 'K' Elements", desc: "Efficiently find largest/smallest elements.", difficulty: "Medium", count: 14 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      {/* --- HERO SECTION: PATTERN FOCUSED --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 flex flex-col items-center text-center overflow-hidden">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#0a0a0a] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/15 blur-[120px] rounded-full -z-10" />

        <Badge variant="outline" className="mb-6 py-1.5 px-4 text-sm border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20">
          ✨ Stop Grinding. Start Understanding.
        </Badge>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-5xl mb-6">
          Do not Just Solve. <br className="hidden md:block" />
          Master the <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500">Underlying Patterns</span>.
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The secret to cracking coding interviews is not solving 1000 problems. It is mastering the <strong>15-20 core coding patterns</strong>. We provide the structured roadmap you need.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/patterns">
            <Button size="lg" className="h-12 px-8 text-base font-semibold bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg shadow-orange-500/20">
              Start Learning Patterns <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/problems">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full">
              View All Problems
            </Button>
          </Link>
        </div>
      </section>

      {/* --- VALUE PROP: WHY PATTERNS? --- */}
      <section className="py-20 px-6 border-y border-border/50 bg-muted/20">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Why CodeYodha?</h2>
                <p className="text-muted-foreground">We focus on the <strong>Aha!</strong> moments that stick with you.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                        <BrainCircuit className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Pattern Recognition</h3>
                    <p className="text-muted-foreground">Do not memorize solutions. Learn to recognize when to use a Sliding Window vs. Two Pointers.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                        <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Targeted Practice</h3>
                    <p className="text-muted-foreground">We group problems by pattern. Master one category completely before moving to the next.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4">
                        <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Structured Roadmap</h3>
                    <p className="text-muted-foreground">Follow a proven path from Easy to Hard. Track your progress pattern by pattern.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- PATTERNS PREVIEW GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
            <div>
                <h2 className="text-3xl font-bold">Essential Patterns</h2>
                <p className="text-muted-foreground mt-2">Start with these heavily asked concepts.</p>
            </div>
            <Link href="/patterns" className="hidden md:flex text-orange-600 hover:underline items-center gap-1 font-medium">
                View all patterns <ArrowRight className="w-4 h-4"/>
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patterns.map((pattern) => (
                <Link href={`/patterns/${pattern.title.toLowerCase().replace(/\s+/g, '-')}`} key={pattern.title}>
                    <Card className="h-full hover:shadow-lg hover:border-orange-500/50 transition-all cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Layers className="w-24 h-24 text-foreground" />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
                                    {pattern.title}
                                </CardTitle>
                                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                    {pattern.count} Problems
                                </Badge>
                            </div>
                            <CardDescription className="pt-2 text-sm leading-relaxed">
                                {pattern.desc}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm font-medium mt-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    pattern.difficulty === "Easy" ? "bg-green-500" : 
                                    pattern.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"
                                }`} />
                                {pattern.difficulty}
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
        
        <div className="mt-8 md:hidden text-center">
             <Link href="/patterns" className="text-orange-600 font-medium">View all patterns →</Link>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto bg-linear-to-b from-muted/50 to-muted/10 p-10 rounded-3xl border">
            <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of developers who are shifting from memorization to pattern mastery.
            </p>
            <div className="flex justify-center gap-4">
                 <Link href="/sign-up">
                    <Button size="lg" className="rounded-full px-8">Get Started for Free</Button>
                 </Link>
            </div>
        </div>
      </section>

    </div>
  );
}