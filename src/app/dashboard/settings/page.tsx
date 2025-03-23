"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useGoogleCalendar } from "@/lib/hooks/useGoogleCalendar";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [googleCalSync, setGoogleCalSync] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [dataUsage, setDataUsage] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const { isLoading, error, isConnected, connect, checkConnection } = useGoogleCalendar();
  
  // Handle hydration
  useEffect(() => {
    setMounted(true);
    
    // Check Google Calendar connection status
    const checkGoogleConnection = async () => {
      const status = await checkConnection();
      if (status?.connected) {
        setGoogleCalSync(true);
      }
    };
    
    checkGoogleConnection();
  }, [checkConnection]);

  // Check if dark mode is active
  const isDarkMode = mounted && (resolvedTheme === 'dark');

  const toggleDarkMode = (checked: boolean) => {
    if (checked) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
  };

  const saveChanges = () => {
    toast.success("Settings saved successfully!");
  };
  
  const handleConnectGoogle = async () => {
    try {
      await connect();
      // Note: The connect function will redirect to Google's auth page,
      // so the following code might not execute immediately
      toast.success("Connecting to Google Calendar...");
    } catch (err: any) {
      toast.error(err.message || "Failed to connect to Google Calendar");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="neo-card">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your general application preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive task reminders and app notifications.
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-usage">Data Usage Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow usage data collection to improve the app experience.
                  </p>
                </div>
                <Switch
                  id="data-usage"
                  checked={dataUsage}
                  onCheckedChange={setDataUsage}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically back up your data weekly.
                  </p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="neo-button" onClick={saveChanges}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="neo-card">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how MindSync looks and feels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode on or off.
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme-select">Theme</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme-select">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light - Clean & Simple</SelectItem>
                    <SelectItem value="dark">Dark - Matte Black</SelectItem>
                    <SelectItem value="royal">Royal - Luxurious</SelectItem>
                    <SelectItem value="natural">Natural - Pastel Watercolor</SelectItem>
                    <SelectItem value="buzz">Buzz - Neon Funky</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground pt-1">
                  Choose your preferred application theme.
                </p>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label>Theme Description</Label>
                <div className="rounded-md bg-muted p-3 text-sm">
                  {theme === "light" && "Clean & Simple (#FFFFFF) – Minimalistic, airy & organized."}
                  {theme === "dark" && "Matte Black (#000000) – Developer-friendly, focused & modern."}
                  {theme === "royal" && "Luxurious (#4B0082) – Opulent, elegant & commanding."}
                  {theme === "natural" && "Pastel Watercolor (#A8E6CF) – Organic, calming & creative."}
                  {theme === "buzz" && "Neon Funky (#39FF14) – Energetic, playful & vibrant."}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a more compact layout to fit more content on screen.
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Font Size</Label>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Select font size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground pt-1">
                  Adjust the text size throughout the application.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="neo-button" onClick={saveChanges}>Save Appearance</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="neo-card">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Update your account information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" defaultValue="John Doe" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" defaultValue="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" placeholder="New password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="neo-button" onClick={saveChanges}>Update Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card className="neo-card">
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect with external services and applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="google-calendar">Google Calendar</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync your tasks with Google Calendar.
                  </p>
                </div>
                <Switch
                  id="google-calendar"
                  checked={googleCalSync}
                  onCheckedChange={setGoogleCalSync}
                  disabled={isConnected === true}
                />
              </div>
              
              {googleCalSync && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="google-email">Google Email</Label>
                  <Input 
                    id="google-email" 
                    type="email" 
                    placeholder="Your Google email" 
                    disabled={isConnected === true}
                  />
                  <Button 
                    className="mt-2" 
                    variant="outline" 
                    size="sm"
                    onClick={handleConnectGoogle}
                    disabled={isLoading || isConnected === true}
                  >
                    {isLoading ? "Connecting..." : isConnected ? "Connected" : "Connect Account"}
                  </Button>
                  {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                  {isConnected && <p className="text-sm text-green-600 mt-1">✓ Successfully connected to Google Calendar</p>}
                </div>
              )}
              
              <div className="border-t pt-4">
                <Label className="mb-2 block">Available Integrations</Label>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                      <circle cx="8" cy="8" r="4"></circle>
                      <path d="M10.697 10.697L16 16"></path>
                      <path d="M20.5 14.5L14.5 20.5"></path>
                      <path d="M18.5 16.5L16.5 18.5"></path>
                    </svg>
                    Notion
                  </Button>
                  
                  <Button variant="outline" className="justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                      <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"></path>
                      <path d="M22 16.5V17c0 3-1.79 4-4 4"></path>
                      <path d="M18 16v.43"></path>
                      <path d="M12 16v4"></path>
                      <path d="M16 16v1.45"></path>
                      <path d="M14 16v1.95"></path>
                      <path d="M20 16v2"></path>
                    </svg>
                    Dropbox
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="neo-button" onClick={saveChanges}>Save Integration Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 