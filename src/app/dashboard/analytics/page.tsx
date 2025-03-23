"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChartComponent, BarChartComponent, PieChartComponent, LineChartComponent } from "@/components/charts";

// Sample data for charts
const productivityOverviewData = Array.from({ length: 30 }).map((_, i) => ({
  date: `${i + 1}`,
  tasks: Math.floor(Math.random() * 10) + 1,
  journal: Math.floor(Math.random() * 2),
  reflection: i % 7 === 0 ? 1 : 0
}));

const focusAreaData = [
  { name: "Work Projects", value: 38 },
  { name: "Personal Development", value: 25 },
  { name: "Health & Fitness", value: 18 },
  { name: "Home Management", value: 15 },
  { name: "Social & Leisure", value: 4 }
];

const weeklyTaskData = [
  { name: "Mon", completed: 5, planned: 7 },
  { name: "Tue", completed: 6, planned: 6 },
  { name: "Wed", completed: 8, planned: 8 },
  { name: "Thu", completed: 4, planned: 7 },
  { name: "Fri", completed: 7, planned: 9 },
  { name: "Sat", completed: 3, planned: 5 },
  { name: "Sun", completed: 2, planned: 3 }
];

const taskCategoryData = [
  { name: "Work", value: 42 },
  { name: "Personal", value: 28 },
  { name: "Health", value: 18 },
  { name: "Shopping", value: 12 },
  { name: "Other", value: 8 }
];

const moodDistributionData = [
  { name: "Excellent", value: 9 },
  { name: "Good", value: 12 },
  { name: "Neutral", value: 5 },
  { name: "Poor", value: 4 }
];

const journalTopicsData = [
  { name: "Career", value: 35 },
  { name: "Relationships", value: 25 },
  { name: "Self-improvement", value: 18 },
  { name: "Health", value: 12 },
  { name: "Finances", value: 8 },
  { name: "Other", value: 4 }
];

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your productivity and personal growth metrics.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="journaling">Journaling</TabsTrigger>
          <TabsTrigger value="reflections">Reflections</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">428</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82.5%</div>
                <p className="text-xs text-muted-foreground">
                  +4.3% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Journal Entries</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  <path d="M9 9h1" />
                  <path d="M9 13h6" />
                  <path d="M9 17h6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">
                  +10.2% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reflections</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M7.5 4.27 9 6l-1.5 1.73a2 2 0 1 0 0-3.46Z" />
                  <path d="M19 10c.34.5.5 1 .5 1.5a2.5 2.5 0 0 1-5 0c0-.5.16-1 .5-1.5" />
                  <path d="M2 12h1" />
                  <path d="M21 12h1" />
                  <path d="M12 2v1" />
                  <path d="M12 21v1" />
                  <path d="M4.93 4.93l.71.71" />
                  <path d="M18.36 18.36l.71.71" />
                  <path d="M18.36 5.64l.71-.71" />
                  <path d="M4.93 19.07l.71-.71" />
                  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">
                  +7.6% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <AreaChartComponent
                title="Productivity Overview"
                description="Your productivity metrics for the past 30 days"
                data={productivityOverviewData}
                dataKey="tasks"
                categories={["tasks", "journal", "reflection"]}
                variant="outline"
                height={300}
              />
            </div>
            <div className="col-span-3">
              <PieChartComponent
                title="Top Focus Areas"
                description="Categories you spend most time on"
                data={focusAreaData}
                variant="outline"
                innerRadius={40}
                outerRadius={80}
                height={300}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2">
              <BarChartComponent
                title="Task Completion Trend"
                description="Weekly task completion statistics"
                data={weeklyTaskData}
                dataKey="completed"
                categories={["completed", "planned"]}
                variant="outline"
                height={300}
              />
            </div>
            <div>
              <PieChartComponent
                title="Task Priority Distribution"
                description="Breakdown of task priorities"
                data={taskCategoryData}
                variant="outline"
                height={300}
              />
            </div>
            <div className="col-span-3">
              <LineChartComponent
                title="Task Completion Rate Over Time"
                description="Monthly completion rate trends"
                data={Array.from({ length: 12 }).map((_, i) => ({
                  name: `Month ${i + 1}`,
                  rate: 70 + Math.floor(Math.random() * 25)
                }))}
                dataKey="rate"
                variant="brutal"
                height={300}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journaling">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2">
              <LineChartComponent
                title="Journaling Consistency"
                description="Daily entries over the last 30 days"
                data={Array.from({ length: 30 }).map((_, i) => ({
                  name: `Day ${i + 1}`,
                  entries: Math.random() > 0.7 ? 1 : 0,
                  wordCount: Math.random() > 0.7 ? Math.floor(Math.random() * 500) : 0
                }))}
                dataKey="entries"
                categories={["entries", "wordCount"]}
                variant="outline"
                height={300}
              />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Mood Distribution</CardTitle>
                  <CardDescription>
                    Journal entry sentiment analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChartComponent
                    title=""
                    data={moodDistributionData}
                    variant="flat"
                    innerRadius={0}
                    outerRadius={70}
                    height={240}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3">
              <PieChartComponent
                title="Journal Topics"
                description="Distribution of journal entry topics"
                data={journalTopicsData}
                variant="brutal"
                innerRadius={60}
                outerRadius={100}
                height={300}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reflections">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-3">
              <AreaChartComponent
                title="Reflection Insights"
                description="Tracked metrics from monthly reflections"
                data={Array.from({ length: 12 }).map((_, i) => ({
                  name: `Month ${i + 1}`,
                  satisfaction: Math.floor(Math.random() * 5) + 5,
                  growth: Math.floor(Math.random() * 5) + 4,
                  challenges: Math.floor(Math.random() * 4) + 2
                }))}
                dataKey="satisfaction"
                categories={["satisfaction", "growth", "challenges"]}
                variant="outline"
                height={300}
              />
            </div>
            <div className="col-span-2">
              <LineChartComponent
                title="Goal Progress"
                description="Progress towards goals set in reflections"
                data={Array.from({ length: 12 }).map((_, i) => ({
                  name: `Month ${i + 1}`,
                  career: Math.min(100, (i + 1) * 8 + Math.floor(Math.random() * 10)),
                  health: Math.min(100, (i + 1) * 6 + Math.floor(Math.random() * 15)),
                  personal: Math.min(100, (i + 1) * 7 + Math.floor(Math.random() * 12))
                }))}
                dataKey="career"
                categories={["career", "health", "personal"]}
                variant="brutal"
                height={300}
              />
            </div>
            <div>
              <BarChartComponent
                title="Monthly Reflection Scores"
                description="Self-assessment scores from reflections"
                data={Array.from({ length: 6 }).map((_, i) => ({
                  name: `Month ${i + 1}`,
                  score: Math.floor(Math.random() * 3) + 7
                }))}
                dataKey="score"
                variant="pixel"
                height={300}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 