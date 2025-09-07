"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { format, parseISO, subMonths, startOfMonth, addDays } from "date-fns";
import { LineChartComponent, BarChartComponent, AreaChartComponent } from "@/components/charts";
import { DocumentEditor } from "@/components/document-editor/DocumentEditor";

// Define the type for productivity data
type ProductivityData = {
  date: string;
  completedTasks: number;
  journalEntries: number;
  streak: number;
};

// Sample data for charts
const generateMockProductivityData = (days = 30): ProductivityData[] => {
  const result: ProductivityData[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = subMonths(today, 1);
    date.setDate(date.getDate() + i);
    
    result.push({
      date: format(date, 'yyyy-MM-dd'),
      completedTasks: Math.floor(Math.random() * 8) + 1,
      journalEntries: Math.floor(Math.random() * 3),
      streak: i % 7 === 0 ? 0 : (result[i-1]?.streak || 0) + 1
    });
  }
  return result;
};

// Retrospect type definition
type Retrospect = {
  id: string;
  title: string;
  date: string;
  type: "daily" | "weekly" | "monthly";
  wins: string[];
  challenges: string[];
  improvements: string[];
};

type RetrospectStat = {
  period: string;
  tasksCompleted: number;
  journalEntries: number;
  avgMood: string;
  topCategories: string[];
};

export default function RetrospectPage() {
  // Sample retrospect data
  const [retrospects, setRetrospects] = useState<Retrospect[]>([
    {
      id: "1",
      title: "March 2025 Review",
      date: "2025-03-20",
      type: "monthly",
      wins: [
        "Completed the feature rollout ahead of schedule",
        "Client satisfaction score increased by 15%",
        "Successfully onboarded two new team members",
      ],
      challenges: [
        "Integration with third-party API had some hiccups",
        "Meeting overload in the middle of the month",
      ],
      improvements: [
        "Schedule fewer meetings for better focus time",
        "Set up more automated testing for API integrations",
        "Allocate more time for documentation",
      ],
    },
    {
      id: "2",
      title: "Week 12 Review",
      date: "2025-03-15",
      type: "weekly",
      wins: [
        "Resolved all critical bugs in the backlog",
        "Completed the UI improvements for the dashboard",
      ],
      challenges: [
        "Team member out sick for three days",
        "Some scope creep on the new feature",
      ],
      improvements: [
        "Better define scope boundaries before starting work",
        "Cross-train team members on critical areas",
      ],
    },
    {
      id: "3",
      title: "February 2025 Review",
      date: "2025-02-28",
      type: "monthly",
      wins: [
        "Launched new notification system",
        "Improved database performance by 25%",
        "Received positive user feedback on new UI",
      ],
      challenges: [
        "Unexpected server downtime",
        "Resource allocation challenges",
      ],
      improvements: [
        "Implement better monitoring systems",
        "Create more detailed resource planning",
        "Schedule regular team feedback sessions",
      ],
    },
    {
      id: "4",
      title: "Daily Review - March 22",
      date: "2025-03-22",
      type: "daily",
      wins: [
        "Completed implementation of notification dropdown",
        "Fixed critical bug in task filtering",
      ],
      challenges: [
        "Struggled with CSS layout issues",
        "Limited time for documentation",
      ],
      improvements: [
        "Take short CSS course to improve skills",
        "Block time specifically for documentation",
      ],
    },
  ]);

  // Mock retrospect statistics
  const [retrospectStats, setRetrospectStats] = useState<RetrospectStat[]>([
    {
      period: "March 2025",
      tasksCompleted: 87,
      journalEntries: 26,
      avgMood: "Happy",
      topCategories: ["Work", "Learning", "Health"]
    },
    {
      period: "February 2025",
      tasksCompleted: 74,
      journalEntries: 22,
      avgMood: "Neutral",
      topCategories: ["Work", "Personal", "Health"]
    },
    {
      period: "January 2025",
      tasksCompleted: 65,
      journalEntries: 15,
      avgMood: "Stressed",
      topCategories: ["Work", "Deadlines", "Personal"]
    }
  ]);

  const productivityData = generateMockProductivityData();
  
  const [newWin, setNewWin] = useState("");
  const [newWins, setNewWins] = useState<string[]>([]);
  const [newChallenge, setNewChallenge] = useState("");
  const [newChallenges, setNewChallenges] = useState<string[]>([]);
  const [newImprovement, setNewImprovement] = useState("");
  const [newImprovements, setNewImprovements] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize slideshow
  useEffect(() => {
    startSlideshow();
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [retrospects.length]);

  // Handle slideshow navigation
  const startSlideshow = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % retrospects.length);
    }, 8000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Reset interval when manually navigating
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    startSlideshow();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % retrospects.length);
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    startSlideshow();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + retrospects.length) % retrospects.length);
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    startSlideshow();
  };

  // Handle adding items to lists
  const addWin = () => {
    if (newWin.trim() === "") return;
    setNewWins([...newWins, newWin]);
    setNewWin("");
  };

  const addChallenge = () => {
    if (newChallenge.trim() === "") return;
    setNewChallenges([...newChallenges, newChallenge]);
    setNewChallenge("");
  };

  const addImprovement = () => {
    if (newImprovement.trim() === "") return;
    setNewImprovements([...newImprovements, newImprovement]);
    setNewImprovement("");
  };

  // Create new retrospect
  const createRetrospect = () => {
    if (newTitle.trim() === "" || newWins.length === 0) return;

    const newRetrospect: Retrospect = {
      id: Date.now().toString(),
      title: newTitle,
      date: new Date().toISOString().split("T")[0],
      type: newType,
      wins: newWins,
      challenges: newChallenges,
      improvements: newImprovements,
    };

    setRetrospects([newRetrospect, ...retrospects]);
    
    // Reset form
    setNewTitle("");
    setNewWins([]);
    setNewChallenges([]);
    setNewImprovements([]);
    setNewType("weekly");
  };

  // Get productivity trend data
  const getProductivityTrend = () => {
    const totalTasks = productivityData.reduce((sum, day) => sum + day.completedTasks, 0);
    const totalEntries = productivityData.reduce((sum, day) => sum + day.journalEntries, 0);
    const avgTasksPerDay = totalTasks / productivityData.length;
    const avgEntriesPerDay = totalEntries / productivityData.length;
    
    return { 
      totalTasks, 
      totalEntries, 
      avgTasksPerDay: avgTasksPerDay.toFixed(1),
      avgEntriesPerDay: avgEntriesPerDay.toFixed(1),
      taskTrend: totalTasks > 70 ? "increasing" : "decreasing",
      entryTrend: totalEntries > 20 ? "increasing" : "decreasing",
    };
  };
  
  const productivityTrend = getProductivityTrend();

  // Enhanced productivity data visualization
  const productivityTrendsData = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      tasks: Math.floor(Math.random() * 8) + 1,
      journal: Math.random() > 0.3 ? 1 : 0,
      reflection: i % 7 === 0 ? 1 : 0,
    };
  });

  const categoryTrendsData = retrospectStats.map(stat => ({
    name: stat.period,
    tasks: stat.tasksCompleted,
    journal: stat.journalEntries,
    categories: stat.topCategories.length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Retrospective</h2>
          <p className="text-muted-foreground">Review your progress and plan for improvement</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Retrospect</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>New Retrospective</DialogTitle>
              <DialogDescription>
                Reflect on your progress, challenges, and plan improvements.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="grid gap-2 col-span-1 sm:col-span-3">
                  <Label htmlFor="retro-title">Title</Label>
                  <Input
                    id="retro-title"
                    placeholder="Enter a title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="retro-type">Type</Label>
                  <select
                    id="retro-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "daily" | "weekly" | "monthly")}
                    aria-label="Retrospect Type"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <Tabs defaultValue="wins" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="wins">Wins</TabsTrigger>
                  <TabsTrigger value="challenges">Challenges</TabsTrigger>
                  <TabsTrigger value="improvements">Improvements</TabsTrigger>
                </TabsList>
                <TabsContent value="wins" className="space-y-4">
                  <div className="space-y-2">
                    <DocumentEditor
                      value={newWin}
                      onChange={(content) => setNewWin(content)}
                      placeholder="Describe a win or achievement... Type '/' for commands"
                      minHeight="80px"
                      compact={true}
                    />
                    <Button type="button" onClick={addWin} className="w-full">
                      Add Win
                    </Button>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {newWins.map((win, index) => (
                      <li key={index} className="text-sm">
                        {win}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="challenges" className="space-y-4">
                  <div className="space-y-2">
                    <DocumentEditor
                      value={newChallenge}
                      onChange={(content) => setNewChallenge(content)}
                      placeholder="Describe a challenge or obstacle... Type '/' for commands"
                      minHeight="80px"
                      compact={true}
                    />
                    <Button type="button" onClick={addChallenge} className="w-full">
                      Add Challenge
                    </Button>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {newChallenges.map((challenge, index) => (
                      <li key={index} className="text-sm">
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="improvements" className="space-y-4">
                  <div className="space-y-2">
                    <DocumentEditor
                      value={newImprovement}
                      onChange={(content) => setNewImprovement(content)}
                      placeholder="Describe an improvement or action item... Type '/' for commands"
                      minHeight="80px"
                      compact={true}
                    />
                    <Button type="button" onClick={addImprovement} className="w-full">
                      Add Improvement
                    </Button>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {newImprovements.map((improvement, index) => (
                      <li key={index} className="text-sm">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={createRetrospect} className="w-full sm:w-auto">Save Retrospect</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Retrospective and Insights Tabs */}
      <Tabs defaultValue="retrospectives" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="retrospectives">Retrospectives</TabsTrigger>
          <TabsTrigger value="insights">Insights & Analysis</TabsTrigger>
        </TabsList>
        
        {/* Retrospectives Tab Content */}
        <TabsContent value="retrospectives" className="space-y-6">
          {/* Retrospect Slideshow */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Retrospective Highlights</CardTitle>
              <CardDescription>Slide through your past reflections</CardDescription>
            </CardHeader>
            <CardContent className="relative overflow-hidden">
              <div className="relative flex items-center justify-center min-h-[300px]">
                <div 
                  className="absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-500 p-6"
                  style={{ opacity: 1 }}
                >
                  <div className="w-full max-w-2xl">
                    <div className="mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {retrospects[currentSlide].date} · {retrospects[currentSlide].type} retrospective
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{retrospects[currentSlide].title}</h3>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-green-500">Wins</h4>
                        <ul className="space-y-1">
                          {retrospects[currentSlide].wins.map((win, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="mr-2 text-green-500">✓</span>
                              <span>{win}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-amber-500">Challenges</h4>
                        <ul className="space-y-1">
                          {retrospects[currentSlide].challenges.map((challenge, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="mr-2 text-amber-500">!</span>
                              <span>{challenge}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2 text-blue-500">Improvements</h4>
                        <ul className="space-y-1">
                          {retrospects[currentSlide].improvements.map((improvement, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <span className="mr-2 text-blue-500">→</span>
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation buttons */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 hover:bg-background z-10"
                  aria-label="Previous slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>
                <button 
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 hover:bg-background z-10"
                  aria-label="Next slide"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
              
              {/* Dots navigation */}
              <div className="flex justify-center mt-4">
                {retrospects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      currentSlide === index ? "bg-primary" : "bg-muted"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* List of all retrospectives */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">All Retrospectives</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {retrospects.map((retrospect) => (
                <Card key={retrospect.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{retrospect.title}</CardTitle>
                    <CardDescription>
                      {retrospect.date} · {retrospect.type} retrospective
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="wins">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="wins">Wins</TabsTrigger>
                        <TabsTrigger value="challenges">Challenges</TabsTrigger>
                        <TabsTrigger value="improvements">Improvements</TabsTrigger>
                      </TabsList>
                      <TabsContent value="wins" className="space-y-1 pt-3">
                        <ul className="list-disc list-inside space-y-1">
                          {retrospect.wins.map((win, index) => (
                            <li key={index} className="text-sm">
                              {win}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      <TabsContent value="challenges" className="space-y-1 pt-3">
                        <ul className="list-disc list-inside space-y-1">
                          {retrospect.challenges.map((challenge, index) => (
                            <li key={index} className="text-sm">
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                      <TabsContent value="improvements" className="space-y-1 pt-3">
                        <ul className="list-disc list-inside space-y-1">
                          {retrospect.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm">
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Insights & Analysis Tab Content */}
        <TabsContent value="insights" className="space-y-6">
          {/* Analytics Dashboard Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productivityTrend.totalTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {productivityTrend.taskTrend === "increasing" ? 
                    <span className="text-green-500">↑ 12% from last month</span> : 
                    <span className="text-red-500">↓ 8% from last month</span>}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productivityTrend.totalEntries}</div>
                <p className="text-xs text-muted-foreground">
                  {productivityTrend.entryTrend === "increasing" ? 
                    <span className="text-green-500">↑ 15% from last month</span> : 
                    <span className="text-red-500">↓ 5% from last month</span>}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Daily Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productivityTrend.avgTasksPerDay}</div>
                <p className="text-xs text-muted-foreground">+0.8 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Journal Consistency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(productivityData.filter(d => d.journalEntries > 0).length / productivityData.length * 100)}%</div>
                <p className="text-xs text-muted-foreground">+10% from last month</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Productivity Trends Section */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Tasks, journal entries, and reflections over time</CardDescription>
              </CardHeader>
              <CardContent>
                <AreaChartComponent
                  title=""
                  data={productivityTrendsData}
                  dataKey="tasks"
                  categories={["tasks", "journal", "reflection"]}
                  variant="brutal"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Task completion and journaling trends</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  title=""
                  data={categoryTrendsData}
                  dataKey="tasks"
                  categories={["tasks", "journal", "categories"]}
                  variant="brutal"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Monthly Performance Analysis */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Monthly Performance Analysis</CardTitle>
              <CardDescription>Review your productivity metrics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {retrospectStats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium">{stat.period}</h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <div className="text-muted-foreground">Tasks:</div>
                      <div>{stat.tasksCompleted}</div>
                      
                      <div className="text-muted-foreground">Journal:</div>
                      <div>{stat.journalEntries} entries</div>
                      
                      <div className="text-muted-foreground">Mood:</div>
                      <div>{stat.avgMood}</div>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">Top categories:</div>
                      <div className="flex flex-wrap gap-1">
                        {stat.topCategories.map((category, catIndex) => (
                          <span key={catIndex} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Insights and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Insights & Recommendations</CardTitle>
              <CardDescription>Based on your retrospectives and productivity data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Productivity Patterns</h4>
                <p className="text-sm">
                  Your task completion is highest on Wednesdays and Thursdays. Consider scheduling your most important work during these peak productivity days.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Recurring Challenges</h4>
                <p className="text-sm">
                  "Meeting overload" appears in multiple retrospectives. Consider implementing a no-meeting day policy to create more focus time.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Progress Highlights</h4>
                <p className="text-sm">
                  Your journal consistency has improved by 10% over the last month, helping you better track your progress and reflections.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Generate Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 