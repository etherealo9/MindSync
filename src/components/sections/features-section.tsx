import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 md:py-28 lg:py-32 border-b-2 border-black dark:border-white relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true"></div>
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" aria-hidden="true"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-12 right-12 w-20 h-20 border-2 border-black/20 dark:border-white/20 rotate-12" aria-hidden="true"></div>
      <div className="absolute bottom-12 left-12 w-16 h-16 border-2 border-black/20 dark:border-white/20 -rotate-6" aria-hidden="true"></div>
      
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="px-4 py-1.5 text-sm uppercase font-bold border-2 border-black dark:border-white bg-white/50 dark:bg-black/50 backdrop-blur-sm">Features</Badge>
          <h2 className="text-4xl font-bold tracking-tighter uppercase sm:text-5xl md:text-6xl relative">
            <span className="bg-accent px-3 py-1">Everything</span> you need
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black dark:bg-white"></div>
          </h2>
          <p className="max-w-[700px] text-xl md:text-2xl font-medium text-foreground/70 mt-6">
            MindSync combines task management, journaling, and reflection with AI assistance.
          </p>
        </div>
        
        <div className="mx-auto grid gap-6 md:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Task Management */}
          <div className="group" data-aos="fade-up">
            <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-accent mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icons.organize className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Task Management</h3>
                <p className="text-foreground/70 text-lg">
                  Create, organize, and prioritize tasks with due dates, categories, and Google Calendar sync.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Journaling */}
          <div className="group" data-aos="fade-up" data-aos-delay="100">
            <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-accent mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icons.journalIcon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Journaling</h3>
                <p className="text-foreground/70 text-lg">
                  Document thoughts and experiences with mood tracking and AI-suggested writing prompts.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Reflection */}
          <div className="group" data-aos="fade-up" data-aos-delay="200">
            <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-accent mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icons.reflect className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Reflection</h3>
                <p className="text-foreground/70 text-lg">
                  Review progress, identify patterns, and plan improvements with guided reflections.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* AI Assistant */}
          <div className="group" data-aos="fade-up" data-aos-delay="300">
            <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-accent mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icons.brain className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">AI Assistant</h3>
                <p className="text-foreground/70 text-lg">
                  Get help with productivity tips, journaling prompts, and task organization.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Calendar Integration */}
          <div className="group" data-aos="fade-up" data-aos-delay="400">
            <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-accent mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icons.calendar className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Calendar Integration</h3>
                <p className="text-foreground/70 text-lg">
                  Sync your tasks with Google Calendar to keep everything in one place.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Analytics */}
          <div className="group" data-aos="fade-up" data-aos-delay="500">
            <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] h-full">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-accent mb-6 transition-transform duration-300 group-hover:scale-110">
                  <Icons.activity className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase">Analytics</h3>
                <p className="text-foreground/70 text-lg">
                  Track productivity metrics and personal growth with visual charts and insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
} 