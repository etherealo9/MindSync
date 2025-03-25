import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            Start Being <span className="bg-accent px-3 py-1">Productive</span> Today
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black dark:bg-white"></div>
          </h2>
          <p className="max-w-[700px] text-xl md:text-2xl font-medium text-foreground/70 mt-6">
            Get started in minutes with our simple setup process. No complex configuration needed.
          </p>
        </div>
        
        {/* Key Features Highlight */}
        <div className="container px-4 md:px-6">
          <div className="bg-accent/20 backdrop-blur-sm rounded-xl p-8 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)]">
            <h3 className="text-3xl font-bold mb-6 text-center uppercase">Three Simple Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background/60 dark:bg-background/40 p-5 rounded-lg border-2 border-black dark:border-white">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mr-3">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h4 className="text-xl font-bold">Deploy Instantly</h4>
                </div>
                <p className="text-foreground/80">Click once to deploy to your preferred platform - Netlify, Vercel, or Docker.</p>
              </div>
              
              <div className="bg-background/60 dark:bg-background/40 p-5 rounded-lg border-2 border-black dark:border-white">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mr-3">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h4 className="text-xl font-bold">Connect Your Tools</h4>
                </div>
                <p className="text-foreground/80">Add your API keys for Supabase and AI services - your data stays under your control.</p>
              </div>
              
              <div className="bg-background/60 dark:bg-background/40 p-5 rounded-lg border-2 border-black dark:border-white">
                <div className="flex items-center mb-3">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mr-3">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h4 className="text-xl font-bold">Start Growing</h4>
                </div>
                <p className="text-foreground/80">Begin organizing tasks, journaling, and getting AI-powered insights for your growth.</p>
              </div>
            </div>
          </div>
        
          <div className="mt-20 mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connecting line for desktop */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black/10 dark:bg-white/10 hidden md:block" aria-hidden="true"></div>
            
            {/* Frontend */}
            <div className="flex flex-col relative animate-slide-up">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent mb-8 mx-auto z-10 shadow-lg">
                <Icons.laptop className="h-10 w-10" />
              </div>
              <div className="absolute top-[60px] left-1/2 h-10 w-0.5 bg-black/10 dark:bg-white/10 -translate-x-1/2" aria-hidden="true"></div>
              <div className="bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-xl p-6 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
                <h3 className="text-2xl font-bold mb-4 uppercase text-center">Modern Interface</h3>
                <ul className="space-y-4">
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">Lightning-fast Next.js App</span>
                  </li>
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">Beautiful UI Components</span>
                  </li>
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">Mobile-First Design</span>
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
                <h3 className="text-2xl font-bold mb-4 uppercase text-center">Secure Backend</h3>
                <ul className="space-y-4">
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">End-to-End Encryption</span>
                  </li>
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">Your Private Database</span>
                  </li>
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">Regular Backups</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Integrations */}
            <div className="flex flex-col relative animate-slide-up" style={{ animationDelay: "600ms" }}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent mb-8 mx-auto z-10 shadow-lg">
                <Icons.zap className="h-10 w-10" />
              </div>
              <div className="absolute top-[60px] left-1/2 h-10 w-0.5 bg-black/10 dark:bg-white/10 -translate-x-1/2" aria-hidden="true"></div>
              <div className="bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-xl p-6 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.2)]">
                <h3 className="text-2xl font-bold mb-4 uppercase text-center">Smart AI</h3>
                <ul className="space-y-4">
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">GPT-4 Integration</span>
                  </li>
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">Custom AI Models</span>
                  </li>
                  <li className="flex items-center bg-white/30 dark:bg-black/30 p-3 rounded-lg transition-transform hover:translate-x-1">
                    <div className="h-8 w-8 rounded-full bg-accent/30 flex items-center justify-center mr-3">
                      <Icons.check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-lg font-medium">Smart Automation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="mt-20 text-center">
            <div className="inline-block bg-accent/20 backdrop-blur-sm rounded-xl p-8 border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.7)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)]">
              <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Productivity?</h3>
              <p className="text-xl text-foreground/70 mb-6">Join 1,000+ developers who've already upgraded their workflow</p>
              <Link href="/dashboard" className="inline-block">
                <Button size="lg" className="neo-button px-8 py-6 text-lg font-bold">
                  Get Started Free
                  <Icons.arrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 