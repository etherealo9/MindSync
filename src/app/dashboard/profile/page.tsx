"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useAuth } from "@/lib/supabase/auth-context";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

// Define a type for user profile data
type UserProfile = {
  id?: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  timezone?: string;
  avatar_url?: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        // If profile exists, use it
        if (data) {
          setProfile(data);
        } else {
          // Create a default profile if none exists
          setProfile({
            user_id: user.id,
            first_name: '',
            last_name: '',
            bio: '',
            location: '',
            timezone: ''
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Save profile changes
  const saveProfile = async () => {
    if (!user || !profile) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile field changes
  const handleChange = (field: keyof UserProfile, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile information and view your stats.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Your profile picture will be shown across the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <OptimizedImage
                  src={profile?.avatar_url || "/placeholder-user.jpg"}
                  alt="Profile picture"
                  fill
                  usePlaceholder={true}
                  className="object-cover"
                />
              </div>
              <Button variant="outline" size="sm">
                Change Picture
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
              <CardDescription>
                Your activity and progress stats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Tasks Completed</p>
                  <p className="text-2xl font-bold">347</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Journal Entries</p>
                  <p className="text-2xl font-bold">128</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Reflections</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Days Streak</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information and profile details.
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="First name" 
                        value={profile?.first_name || ""}
                        onChange={(e) => handleChange('first_name', e.target.value)}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Last name" 
                        value={profile?.last_name || ""}
                        onChange={(e) => handleChange('last_name', e.target.value)}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Your email" 
                      value={user?.email || ""}
                      readOnly={true}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email addresses can only be changed in account settings.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us a bit about yourself" 
                      value={profile?.bio || ""}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        placeholder="Your location" 
                        value={profile?.location || ""}
                        onChange={(e) => handleChange('location', e.target.value)}
                        readOnly={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input 
                        id="timezone" 
                        placeholder="Your timezone" 
                        value={profile?.timezone || ""}
                        onChange={(e) => handleChange('timezone', e.target.value)}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {isEditing && (
                    <Button onClick={saveProfile}>
                      Save Changes
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                  <CardDescription>
                    Configure your account preferences and settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Account preferences are managed in the Settings page.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 