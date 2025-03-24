"use client";

import { useState, useEffect } from "react";
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
import { Task, TasksAPI } from "@/lib/supabase/database";
import { useAuth } from "@/lib/supabase/auth-context";
import { toast } from "sonner";
import AssistantHelper from "@/components/ai/AssistantHelper";

// Helper type for task completion data
type TaskCompletionData = {
  name: string;
  done: number;
  total: number;
};

export default function TasksPage() {
  const { user } = useAuth();
  const [view, setView] = useState<"list" | "kanban">("list");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showAIHelper, setShowAIHelper] = useState(false);

  // Move the fetchTasks function out of the useEffect so it can be reused
  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const userTasks = await TasksAPI.getTasks(user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, [user]);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(new Date());
  const [newTaskDueTime, setNewTaskDueTime] = useState("12:00");
  const [newTaskReminder, setNewTaskReminder] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("todo");
  const [newTaskAttachments, setNewTaskAttachments] = useState<string[]>([]);

  // Sample data for task analytics
  const taskCompletionData: TaskCompletionData[] = [
    { name: "Mon", done: tasks.filter(t => t.status === "done").length, total: tasks.length },
    { name: "Tue", done: tasks.filter(t => t.status === "done").length, total: tasks.length },
    { name: "Wed", done: tasks.filter(t => t.status === "done").length, total: tasks.length },
    { name: "Thu", done: tasks.filter(t => t.status === "done").length, total: tasks.length },
    { name: "Fri", done: tasks.filter(t => t.status === "done").length, total: tasks.length },
    { name: "Sat", done: tasks.filter(t => t.status === "done").length, total: tasks.length },
    { name: "Sun", done: tasks.filter(t => t.status === "done").length, total: tasks.length },
  ];

  const taskPriorityData = [
    { name: "High", value: tasks.filter(t => t.priority === "high").length },
    { name: "Medium", value: tasks.filter(t => t.priority === "medium").length },
    { name: "Low", value: tasks.filter(t => t.priority === "low").length },
  ];

  const taskStatusData = [
    { name: "To Do", value: tasks.filter(t => t.status === "todo").length },
    { name: "In Progress", value: tasks.filter(t => t.status === "in_progress").length },
    { name: "Done", value: tasks.filter(t => t.status === "done").length },
  ];

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;
    
    const newStatus = taskToUpdate.status === "done" ? "todo" : "done";
    
    try {
      const updatedTask = await TasksAPI.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast.success(`Task marked as ${newStatus === "done" ? "complete" : "incomplete"}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  // Add new task
  const addTask = async () => {
    if (!user || !newTaskTitle.trim() || !newTaskDueDate) return;

    try {
      const newTask = await TasksAPI.createTask({
        user_id: user.id,
        title: newTaskTitle,
        description: "",
        due_date: new Date(newTaskDueDate.toDateString() + " " + newTaskDueTime).toISOString(),
        status: newTaskStatus,
        priority: newTaskPriority,
      });

      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
      setNewTaskPriority("medium");
      setNewTaskDueDate(new Date());
      setNewTaskDueTime("12:00");
      setNewTaskReminder(false);
      setNewTaskAttachments([]);
      setNewTaskStatus("todo");
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const updatedTask = await TasksAPI.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast.success("Task status updated");
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      await TasksAPI.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
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

  const handleDrop = async (e: React.DragEvent, status: Task["status"]) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const taskToUpdate = tasks.find(task => task.id === taskId);
    
    if (!taskToUpdate) return;

    try {
      // Optimistically update the UI
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status } : task
      ));

      // Update in the database
      await TasksAPI.updateTask(taskId, { status });
      toast.success("Task status updated");
    } catch (error) {
      // Revert the optimistic update on error
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: taskToUpdate.status } : task
      ));
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map(file => file.name);
      setNewTaskAttachments([...newTaskAttachments, ...fileNames]);
    }
  };

  const handleAIResult = async (result: string) => {
    if (selectedTask) {
      // Handle modification of existing task
      try {
        await TasksAPI.updateTask(selectedTask.id, {
          ...selectedTask,
          description: result
        });
        
        // Update the local state
        fetchTasks(); // Re-fetch tasks or update local state directly
        
        toast.success("Task updated with AI suggestion");
        setShowAIHelper(false);
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Failed to update task");
      }
    } else {
      // Handle adding a new task
      try {
        await TasksAPI.createTask({
          user_id: user!.id,
          title: "AI Generated Task",
          description: result,
          priority: "medium",
          status: "todo",
          due_date: new Date().toISOString().split('T')[0] // Today
        });
        
        fetchTasks(); // Re-fetch tasks
        toast.success("New task created with AI");
        setShowAIHelper(false);
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Failed to create new task");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
                  <Select value={newTaskStatus} onValueChange={(v) => setNewTaskStatus(v as "todo" | "in_progress" | "done")}>
                    <SelectTrigger id="task-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
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
            <div className="space-y-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className={task.status === "done" ? "text-lg line-through text-muted-foreground" : "text-lg"}>
                        {task.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        checked={task.status === "done"}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="size-5"
                      />
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
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {view === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Todo Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "todo")}
                className="space-y-3"
              >
                <h3 className="font-semibold mb-4">To Do</h3>
                <div className="space-y-3 min-h-[200px] p-4 rounded-lg border-2 border-dashed">
                  {tasks
                    .filter((task) => task.status === "todo")
                    .map((task) => (
                      <Card 
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="cursor-move hover:border-accent transition-colors"
                      >
                        <CardHeader>
                          <CardTitle className="text-sm">{task.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityClass(task.priority)}`} />
                            <p className="text-xs text-muted-foreground">
                              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                            </p>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </div>
              </div>

              {/* In Progress Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "in_progress")}
                className="space-y-3"
              >
                <h3 className="font-semibold mb-4">In Progress</h3>
                <div className="space-y-3 min-h-[200px] p-4 rounded-lg border-2 border-dashed">
                  {tasks
                    .filter((task) => task.status === "in_progress")
                    .map((task) => (
                      <Card 
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="cursor-move hover:border-accent transition-colors"
                      >
                        <CardHeader>
                          <CardTitle className="text-sm">{task.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityClass(task.priority)}`} />
                            <p className="text-xs text-muted-foreground">
                              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                            </p>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Done Column */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "done")}
                className="space-y-3"
              >
                <h3 className="font-semibold mb-4">Done</h3>
                <div className="space-y-3 min-h-[200px] p-4 rounded-lg border-2 border-dashed">
                  {tasks
                    .filter((task) => task.status === "done")
                    .map((task) => (
                      <Card 
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="cursor-move hover:border-accent transition-colors"
                      >
                        <CardHeader>
                          <CardTitle className="text-sm">{task.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityClass(task.priority)}`} />
                            <p className="text-xs text-muted-foreground">
                              Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                            </p>
                          </div>
                        </CardHeader>
                      </Card>
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
                  dataKey="done"
                  categories={["done", "total"]}
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
                  Your weekly task completion rate is {Math.round((taskCompletionData.reduce((sum, day) => sum + day.done, 0) / 
                  taskCompletionData.reduce((sum, day) => sum + day.total, 0)) * 100)}%. 
                  {Math.round((taskCompletionData.reduce((sum, day) => sum + day.done, 0) / 
                  taskCompletionData.reduce((sum, day) => sum + day.total, 0)) * 100) > 70 ? 
                    "Excellent work keeping on top of your tasks!" : 
                    "Consider breaking down tasks into smaller, more manageable pieces to improve completion rate."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAIHelper && (
        <Dialog open={showAIHelper} onOpenChange={setShowAIHelper}>
          <DialogContent className="max-w-[800px]">
            <DialogHeader>
              <DialogTitle>AI Task Assistant</DialogTitle>
              <DialogDescription>
                {selectedTask 
                  ? "Modify your task with AI assistance" 
                  : "Create a new task with AI assistance"}
              </DialogDescription>
            </DialogHeader>
            <AssistantHelper 
              type="task"
              originalContent={selectedTask?.description}
              onResult={handleAIResult}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAIHelper(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 