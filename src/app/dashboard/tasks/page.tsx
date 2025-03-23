"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { AreaChartComponent, PieChartComponent, BarChartComponent } from "@/components/charts";

// Task type definition
type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  dueTime?: string;
  priority: "low" | "medium" | "high";
  reminder?: boolean;
  attachments?: string[];
  status: "todo" | "in-progress" | "done";
};

export default function TasksPage() {
  // State for selected view
  const [view, setView] = useState<"list" | "kanban">("list");
  
  // Sample tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      completed: false,
      dueDate: "2025-03-23",
      priority: "high",
      status: "todo",
    },
    {
      id: "2",
      title: "Research market trends",
      completed: false,
      dueDate: "2025-03-24",
      priority: "medium",
      status: "in-progress",
    },
    {
      id: "3",
      title: "Team meeting prep",
      completed: false,
      dueDate: "2025-03-25",
      priority: "low",
      status: "todo",
    },
    {
      id: "4",
      title: "Update documentation",
      completed: true,
      dueDate: "2025-03-22",
      priority: "medium",
      status: "done",
    },
  ]);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(new Date());
  const [newTaskDueTime, setNewTaskDueTime] = useState("12:00");
  const [newTaskReminder, setNewTaskReminder] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<"todo" | "in-progress" | "done">("todo");
  const [newTaskAttachments, setNewTaskAttachments] = useState<string[]>([]);

  // Sample data for task analytics
  const taskCompletionData = [
    { name: "Mon", completed: 5, total: 8 },
    { name: "Tue", completed: 4, total: 6 },
    { name: "Wed", completed: 7, total: 9 },
    { name: "Thu", completed: 3, total: 5 },
    { name: "Fri", completed: 6, total: 8 },
    { name: "Sat", completed: 2, total: 4 },
    { name: "Sun", completed: 1, total: 2 },
  ];

  const taskPriorityData = [
    { name: "High", value: tasks.filter(t => t.priority === "high").length },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length },
    { name: "Low", value: tasks.filter(t => t.priority === "low").length },
  ];

  const taskStatusData = [
    { name: "To Do", value: tasks.filter(t => t.status === "todo").length },
    { name: "In Progress", value: tasks.filter(t => t.status === "in-progress").length },
    { name: "Done", value: tasks.filter(t => t.status === "done").length },
  ];

  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId 
          ? { 
              ...task, 
              completed: !task.completed,
              status: !task.completed ? "done" : task.status 
            } 
          : task
      )
    );
  };

  // Add new task
  const addTask = () => {
    if (newTaskTitle.trim() === "") return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      dueDate: newTaskDueDate ? format(newTaskDueDate, "yyyy-MM-dd") : new Date().toISOString().split("T")[0],
      dueTime: newTaskDueTime,
      priority: newTaskPriority,
      reminder: newTaskReminder,
      attachments: newTaskAttachments,
      status: newTaskStatus,
    };
    
    setTasks([...tasks, newTask]);
    
    // Reset form fields
    setNewTaskTitle("");
    setNewTaskPriority("medium");
    setNewTaskDueDate(new Date());
    setNewTaskDueTime("12:00");
    setNewTaskReminder(false);
    setNewTaskAttachments([]);
    setNewTaskStatus("todo");
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Get priority class
  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  // Handle task drag and drop
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: "todo" | "in-progress" | "done") => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: status, completed: status === "done" } : task
      )
    );
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(file => file.name);
      setNewTaskAttachments([...newTaskAttachments, ...fileNames]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">Tasks</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* View toggle */}
          <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")} className="w-full sm:w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="kanban">Kanban View</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Add Task Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto mt-2 sm:mt-0">Add New Task</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to keep track of your work.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select value={newTaskPriority} onValueChange={(v) => setNewTaskPriority(v as "low" | "medium" | "high")}>
                    <SelectTrigger id="task-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="task-status">Status</Label>
                  <Select value={newTaskStatus} onValueChange={(v) => setNewTaskStatus(v as "todo" | "in-progress" | "done")}>
                    <SelectTrigger id="task-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-date">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="task-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTaskDueDate}
                          onSelect={setNewTaskDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="task-time">Due Time</Label>
                    <Input
                      id="task-time"
                      type="time"
                      value={newTaskDueTime}
                      onChange={(e) => setNewTaskDueTime(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="task-reminder"
                    checked={newTaskReminder}
                    onCheckedChange={(checked) => setNewTaskReminder(checked as boolean)}
                  />
                  <Label htmlFor="task-reminder">Set Reminder</Label>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="task-attachments">Attachments</Label>
                  <Input
                    id="task-attachments"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="max-w-full"
                  />
                  {newTaskAttachments.length > 0 && (
                    <div className="mt-2 text-sm overflow-x-auto">
                      Files: {newTaskAttachments.join(", ")}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <DialogClose asChild>
                  <Button variant="outline" className="w-full sm:w-auto">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={addTask} className="w-full sm:w-auto">Add Task</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tasks and Insights Tabs */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="tasks" className="flex-1 md:flex-initial">Tasks</TabsTrigger>
          <TabsTrigger value="insights" className="flex-1 md:flex-initial">Insights</TabsTrigger>
        </TabsList>
        
        {/* Tasks Tab Content */}
        <TabsContent value="tasks" className="space-y-6 mt-2">
          {view === "list" && (
            <div className="space-y-6 sm:space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks
                      .filter((task) => !task.completed)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex flex-wrap items-center gap-3 border-b pb-4 last:border-0 last:pb-0 overflow-hidden"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${getPriorityClass(
                              task.priority
                            )}`}
                          ></div>
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="size-5"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                              {task.dueTime ? ` at ${task.dueTime}` : ""}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="size-8"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks
                      .filter((task) => task.completed)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex flex-wrap items-center gap-3 border-b pb-4 last:border-0 last:pb-0 overflow-hidden"
                        >
                          <div
                            className={`w-4 h-4 rounded-full ${getPriorityClass(
                              task.priority
                            )}`}
                          ></div>
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="size-5"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium flex-1 break-words min-w-0 pr-2">{task.title}</p>
                            
                            {task.status === "done" ? (
                              <p className="text-sm font-medium flex-1 break-words min-w-0 pr-2 line-through text-muted-foreground">{task.title}</p>
                            ) : (
                              <p className="text-sm font-medium flex-1 break-words min-w-0 pr-2">{task.title}</p>
                            )}

                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(task.id)}
                            className="size-8"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-4"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {view === "kanban" && (
            <div className="grid grid-cols-1 gap-6 sm:gap-4 lg:grid-cols-3">
              {/* To Do Column */}
              <div 
                className="bg-secondary/50 rounded-lg p-4 min-h-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "todo")}
              >
                <h3 className="font-semibold mb-4">To Do</h3>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status === "todo")
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="bg-background p-3 rounded-md border cursor-move"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${getPriorityClass(
                              task.priority
                            )}`}
                          ></div>
                          <p className="text-sm font-medium flex-1 break-words min-w-0 pr-2">{task.title}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                            className="size-6 h-6 flex-shrink-0 ml-auto"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {task.dueTime ? ` at ${task.dueTime}` : ""}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div 
                className="bg-secondary/50 rounded-lg p-4 min-h-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "in-progress")}
              >
                <h3 className="font-semibold mb-4">In Progress</h3>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status === "in-progress")
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="bg-background p-3 rounded-md border cursor-move"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${getPriorityClass(
                              task.priority
                            )}`}
                          ></div>
                          <p className="text-sm font-medium flex-1 break-words min-w-0 pr-2">{task.title}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                            className="size-6 h-6 flex-shrink-0 ml-auto"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {task.dueTime ? ` at ${task.dueTime}` : ""}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Done Column */}
              <div 
                className="bg-secondary/50 rounded-lg p-4 min-h-[200px]"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "done")}
              >
                <h3 className="font-semibold mb-4">Done</h3>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status === "done")
                    .map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="bg-background p-3 rounded-md border cursor-move"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${getPriorityClass(
                              task.priority
                            )}`}
                          ></div>
                          <p className="text-sm font-medium flex-1 break-words min-w-0 pr-2">{task.title}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                            className="size-6 h-6 flex-shrink-0 ml-auto"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="size-3"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                          {task.dueTime ? ` at ${task.dueTime}` : ""}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Insights Tab Content */}
        <TabsContent value="insights" className="space-y-6 mt-2">
          <div className="grid gap-6 md:gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                <CardDescription>Current task distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  title=""
                  data={taskStatusData}
                  variant="brutal"
                  innerRadius={0}
                  outerRadius={70}
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                <CardDescription>Weekly progress overview</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartComponent
                  title=""
                  data={taskCompletionData}
                  dataKey="completed"
                  categories={["completed", "total"]}
                  variant="brutal"
                  height={200}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
                <CardDescription>Tasks by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartComponent
                  title=""
                  data={taskPriorityData}
                  variant="brutal"
                  innerRadius={0}
                  outerRadius={70}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Productivity Insights</CardTitle>
              <CardDescription>Based on your task management patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Task Completion Patterns</h4>
                <p className="text-sm">
                  You tend to complete more tasks mid-week. Consider scheduling your most challenging work for Wednesday and Thursday.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Priority Management</h4>
                <p className="text-sm">
                  {taskPriorityData[0].value > taskPriorityData[2].value ? 
                    "You have more high priority tasks than low priority ones. Consider delegating or rescheduling some tasks to balance your workload." : 
                    "Your priority distribution looks balanced. Good job managing your workload!"}
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Completion Rate</h4>
                <p className="text-sm">
                  Your weekly task completion rate is {Math.round((taskCompletionData.reduce((sum, day) => sum + day.completed, 0) / 
                  taskCompletionData.reduce((sum, day) => sum + day.total, 0)) * 100)}%. 
                  {Math.round((taskCompletionData.reduce((sum, day) => sum + day.completed, 0) / 
                  taskCompletionData.reduce((sum, day) => sum + day.total, 0)) * 100) > 70 ? 
                    "Excellent work keeping on top of your tasks!" : 
                    "Consider breaking down tasks into smaller, more manageable pieces to improve completion rate."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 