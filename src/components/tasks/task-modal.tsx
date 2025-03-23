"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Icons } from "../ui/icons";
import { Label } from "../ui/label";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function TaskModal() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState<string>("medium");
  const [reminder, setReminder] = useState<boolean>(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" size="sm" className="w-full">
          <Icons.add className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent variant="brutal" className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your to-do list. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="title" className="sm:text-right font-bold">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Task title"
              className="col-span-1 sm:col-span-3 border-2 border-black dark:border-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="description" className="sm:text-right font-bold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Task description"
              className="col-span-1 sm:col-span-3 border-2 border-black dark:border-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label className="sm:text-right font-bold">
              Due Date
            </Label>
            <div className="col-span-1 sm:col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-2 border-black dark:border-white"
                  >
                    <Icons.calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-black dark:border-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label className="sm:text-right font-bold">
              Priority
            </Label>
            <div className="col-span-1 sm:col-span-3">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="border-2 border-black dark:border-white">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent className="border-2 border-black dark:border-white">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label className="sm:text-right font-bold">
              Reminder
            </Label>
            <div className="flex items-center space-x-2 col-span-1 sm:col-span-3">
              <Switch id="reminder" checked={reminder} onCheckedChange={setReminder} />
              <Label htmlFor="reminder">Set reminder</Label>
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button variant="brutalist" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Save Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 