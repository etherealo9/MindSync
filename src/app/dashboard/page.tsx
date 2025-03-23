import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TaskModal } from "@/components/tasks/task-modal";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InteractiveCalendar } from "@/components/dashboard/interactive-calendar";
import { LineChartComponent, PieChartComponent } from "@/components/charts";
import { CalendarView } from "@/components/CalendarView";

// Sample data for productivity chart
const productivityData = [
  { name: "Mon", tasks: 4, mood: 8 },
  { name: "Tue", tasks: 3, mood: 7 },
  { name: "Wed", tasks: 5, mood: 9 },
  { name: "Thu", tasks: 2, mood: 6 },
  { name: "Fri", tasks: 6, mood: 8 },
  { name: "Sat", tasks: 3, mood: 9 },
  { name: "Sun", tasks: 1, mood: 7 },
];

// Sample data for journal topics
const journalTopicsData = [
  { name: "Work", value: 35 },
  { name: "Personal", value: 25 },
  { name: "Health", value: 20 },
  { name: "Ideas", value: 15 },
  { name: "Other", value: 5 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 border-b-2 border-black dark:border-white pb-4">
        <h2 className="text-3xl font-bold uppercase">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm px-2 py-1 font-medium">
            Today is {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/tasks" className="block">
          <Card variant="brutal" className="h-full transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Tasks</CardTitle>
              <Icons.organize className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Tasks remaining today</p>
              <Button variant="accent" size="sm" className="mt-4 w-full">View All</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/journal" className="block">
          <Card variant="brutal" className="h-full transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Journal</CardTitle>
              <Icons.journalIcon className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Journal entries this week</p>
              <Button variant="accent" size="sm" className="mt-4 w-full">View All</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/retrospect" className="block">
          <Card variant="brutal" className="h-full transition-all hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Reflections</CardTitle>
              <Icons.reflect className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Monthly retrospective</p>
              <Button variant="accent" size="sm" className="mt-4 w-full">View All</Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <InteractiveCalendar />
      </div>

      {/* Weekly Productivity Overview */}
      <div>
        <LineChartComponent
          title="Weekly Productivity"
          description="Task completion and mood rating for the past week"
          data={productivityData}
          dataKey="tasks"
          categories={["tasks", "mood"]}
          variant="brutal"
          height={250}
        />
      </div>

      {/* Google Calendar Section */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        <CalendarView />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card variant="outline" className="border-2">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-60 pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-accent rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold">Complete project proposal</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Due today</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-accent rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold">Research market trends</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Due tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-accent rounded-full"></div>
                  <div>
                    <p className="text-sm font-bold">Team meeting prep</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Due in 2 days</p>
                  </div>
                </div>
                <TaskModal />
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card variant="outline" className="border-2">
          <CardHeader>
            <CardTitle>Journal Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <ScrollArea className="h-60 pr-4">
                  <div className="space-y-4">
                    <div className="border-l-2 border-accent pl-4">
                      <p className="text-sm font-bold">"Today I made significant progress on the new feature implementation. Feeling more confident about meeting the deadline."</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Yesterday's entry</p>
                    </div>
                    <div className="border-l-2 border-accent pl-4">
                      <p className="text-sm font-bold">"Meeting with the client went well. We clarified requirements and set expectations for the project timeline."</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">2 days ago</p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="col-span-1">
                <PieChartComponent
                  title=""
                  data={journalTopicsData}
                  innerRadius={40}
                  outerRadius={70}
                  variant="flat"
                  height={220}
                />
              </div>
              <div className="col-span-2">
                <Button variant="accent" size="sm" className="w-full">New Journal Entry</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card variant="flat" className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold uppercase">Need Assistance?</h3>
            <p className="text-sm text-muted-foreground">Our AI assistant can help you stay productive and motivated.</p>
          </div>
          <Button variant="brutalist" size="lg" className="border-2 border-black dark:border-white">
            <Icons.brain className="mr-2 h-5 w-5" />
            Open Assistant
          </Button>
        </div>
      </Card>
    </div>
  );
} 