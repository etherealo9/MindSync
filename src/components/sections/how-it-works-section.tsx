import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 md:py-28 lg:py-32 border-b-2 border-black dark:border-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" aria-hidden="true"></div>
      <div className="absolute right-0 bottom-0 w-72 h-72 bg-accent/20 rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl" aria-hidden="true"></div>
      
      {/* Diagonal lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-1 -bottom-1 left-0 right-0 w-full h-[calc(100%+2px)] bg-[linear-gradient(45deg,transparent_49.5%,rgba(0,0,0,0.05)_49.5%,rgba(0,0,0,0.05)_50.5%,transparent_50.5%)] bg-[length:25px_25px]"></div>
      </div>
      
      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="px-4 py-1.5 text-sm uppercase font-bold border-2 border-black dark:border-white bg-white/50 dark:bg-black/50 backdrop-blur-sm">How It Works</Badge>
          <h2 className="text-4xl font-bold tracking-tighter uppercase sm:text-5xl md:text-6xl relative">
            Built with <span className="bg-accent px-3 py-1">modern tech</span>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black dark:bg-white"></div>
          </h2>
          <p className="max-w-[700px] text-xl md:text-2xl font-medium text-foreground/70 mt-6">
            MindSync is built with a modern tech stack focused on performance and developer experience.
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connecting line for desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/10 dark:bg-white/10 hidden md:block" aria-hidden="true"></div>
          
          {/* Frontend */}
          <div className="flex flex-col relative animate-slide-up" style={{ animationDelay: "100ms" }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent mb-8 mx-auto z-10 shadow-lg">
              <Icons.laptop className="h-10 w-10" />
            </div>
            <div className="absolute top-[60px] left-1/2 h-10 w-0.5 bg-black/10 dark:bg-white/10 -translate-x-1/2" aria-hidden="true"></div>
            <div className="bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-xl p-6 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
              <h3 className="text-2xl font-bold mb-4 uppercase text-center">Frontend</h3>
              <ul className="space-y-4">
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">Next.js with App Router</span>
                </li>
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">React & TypeScript</span>
                </li>
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">TailwindCSS & Shadcn UI</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Backend */}
          <div className="flex flex-col relative animate-slide-up" style={{ animationDelay: "300ms" }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent mb-8 mx-auto z-10 shadow-lg">
              <Icons.database className="h-10 w-10" />
            </div>
            <div className="absolute top-[60px] left-1/2 h-10 w-0.5 bg-black/10 dark:bg-white/10 -translate-x-1/2" aria-hidden="true"></div>
            <div className="bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-xl p-6 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
              <h3 className="text-2xl font-bold mb-4 uppercase text-center">Backend</h3>
              <ul className="space-y-4">
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">Supabase for authentication</span>
                </li>
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">PostgreSQL database</span>
                </li>
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">Real-time subscriptions</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Integrations */}
          <div className="flex flex-col relative animate-slide-up" style={{ animationDelay: "500ms" }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent mb-8 mx-auto z-10 shadow-lg">
              <Icons.zap className="h-10 w-10" />
            </div>
            <div className="absolute top-[60px] left-1/2 h-10 w-0.5 bg-black/10 dark:bg-white/10 -translate-x-1/2" aria-hidden="true"></div>
            <div className="bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-xl p-6 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
              <h3 className="text-2xl font-bold mb-4 uppercase text-center">Integrations</h3>
              <ul className="space-y-4">
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">OpenAI for AI assistant</span>
                </li>
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">Google Calendar API</span>
                </li>
                <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                  <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                    <Icons.check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-lg font-medium">OAuth 2.0 authentication</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 