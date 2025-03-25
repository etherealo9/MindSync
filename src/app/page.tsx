import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import dynamicImport from "next/dynamic";
import { ClientAnimatedWrapper } from "@/components/client-animated-wrapper";
import { PWARegister } from "@/components/client-providers";

// Import sections with better loading handling
const FeaturesSection = dynamicImport(() => import('@/components/sections/features-section'), {
  loading: () => <div className="w-full py-12 md:py-24 lg:py-32 min-h-[400px] border-b-2 border-black dark:border-white bg-background/50"></div>,
});

const HowItWorksSection = dynamicImport(() => import('@/components/sections/how-it-works-section'), {
  loading: () => <div className="w-full py-12 md:py-24 lg:py-32 min-h-[400px] border-b-2 border-black dark:border-white bg-background/50"></div>,
});

const GetInvolvedSection = dynamicImport(() => import('@/components/sections/get-involved-section'), {
  loading: () => <div className="w-full py-12 md:py-24 min-h-[400px] border-b-2 border-black dark:border-white bg-background/50"></div>,
});

// Import theme components
const ThemeToggleWrapper = dynamicImport(() => import('@/components/theme-toggle-wrapper'), {
  loading: () => <div className="h-9 w-9 rounded-md bg-muted"></div>,
});

// Use correct static generation config
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-20 items-center border-b-2 border-black dark:border-white px-6 md:px-10 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
          <Link href="/" className="flex items-center gap-2 group">
            <Icons.logo className="h-9 w-9" />
            <h1 className="text-xl font-bold uppercase tracking-wider">MindSync</h1>
          </Link>
        <nav className="ml-auto hidden md:flex gap-8">
          <Link href="#features" className="text-sm font-medium">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium">How It Works</Link>
          <Link href="#get-involved" className="text-sm font-medium">Get Involved</Link>
          <Link href="https://github.com" className="flex items-center gap-1 text-sm font-medium">
            <Icons.github className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
        </nav>
        <div className="ml-auto md:ml-8 flex items-center gap-3">
          <div className="h-9 w-9">
            <ThemeToggleWrapper />
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="font-medium border-2">Log In</Button>
          </Link>
          <Link href="/dashboard" className="hidden md:block">
            <Button className="neo-button px-6">Get Started</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <ClientAnimatedWrapper>
          <section className="w-full py-10 md:py-14 lg:py-20 border-b-2 border-black dark:border-white relative overflow-hidden">
            {/* Abstract background grid for visual interest */}
            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10" aria-hidden="true">
              {Array(100).fill(0).map((_, i) => (
                <div key={i} className={`border border-black/5 dark:border-white/5 ${i % 7 === 0 ? 'bg-accent/5' : ''}`}></div>
              ))}
            </div>
            
            {/* Accent circles */}
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/30 blur-3xl" aria-hidden="true"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true"></div>
            
            <div className="container px-4 md:px-6 relative">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 items-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="px-4 py-1.5 text-sm uppercase font-bold border-2 border-black dark:border-white bg-white/50 dark:bg-black/50 backdrop-blur-sm">Open Source</Badge>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter uppercase leading-[1.1]">
                      <div className="flex items-center gap-2">
                        <span className="bg-foreground text-background px-3 py-1">Mind</span>
                        <span>Sync</span>
                      </div>
                      <span className="text-xl sm:text-2xl md:text-3xl font-medium block mt-3 normal-case text-foreground/80">Transform Your Productivity with AI and Open-Source </span>
                    </h1>
                  </div>
                  <p className="text-lg md:text-xl font-medium max-w-[600px] text-foreground/80 leading-relaxed">
                    Experience a revolutionary way to organize tasks, journal thoughts, and achieve personal growth. Trusted by 1000+ developers worldwide for its privacy-first approach and powerful AI assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Link href="/dashboard" prefetch={false}>
                      <Button size="lg" className="neo-button w-full sm:w-auto px-6 py-5 text-base">
                        Start Free - No Credit Card
                        <Icons.arrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="https://github.com/etherealo9/MindSync" prefetch={false}>
                      <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 px-6 py-5 text-base">
                        <Icons.github className="mr-2 h-5 w-5" />
                        Start With Github For Devs
                      </Button>
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full">
                        <Icons.check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>100% Free & Open Source</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full">
                        <Icons.check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>End-to-End Privacy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500/20 p-1 rounded-full">
                        <Icons.check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>5-Minute Setup</span>
                    </div>
                  </div>
                  <div className="mt-8 p-4 bg-accent/10 rounded-lg border-2 border-black/10 dark:border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-4">
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://avatars.githubusercontent.com/u/1?v=4" alt="User" />
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://avatars.githubusercontent.com/u/2?v=4" alt="User" />
                        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://avatars.githubusercontent.com/u/3?v=4" alt="User" />
                      </div>
                      <p className="text-sm font-medium">
                        Joined by <span className="text-accent-foreground font-bold">1,000+</span> developers who upgraded their productivity this month
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center justify-center lg:justify-end">
                  {/* 3D layered UI mockup */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-accent/40 rounded-lg blur-lg"></div>
                  <div className="w-full max-w-md rounded-lg border-2 border-black dark:border-white overflow-hidden bg-gradient-to-br from-accent/80 to-background p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] relative rotate-1">
                    <div className="rounded-md overflow-hidden border-2 border-black dark:border-white bg-white dark:bg-black">
                      <div className="h-8 bg-muted flex items-center px-3 border-b-2 border-black dark:border-white">
                        <div className="flex space-x-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <div className="h-3 w-3 rounded-full bg-yellow-500" />
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                        </div>
                        <div className="ml-auto mr-auto px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded text-xs font-mono">MindSync</div>
                      </div>
                      <div className="p-5 bg-white dark:bg-black">
                        <div className="space-y-3">
                          <div className="h-6 w-2/3 bg-black/10 dark:bg-white/10 rounded"></div>
                          <div className="h-4 w-5/6 bg-black/5 dark:bg-white/5 rounded"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-6">
                          <div className="h-28 rounded border-2 border-black dark:border-white flex items-center justify-center bg-accent/10">
                            <Icons.organize className="h-12 w-12" />
                          </div>
                          <div className="h-28 rounded border-2 border-black dark:border-white flex items-center justify-center bg-accent/10">
                            <Icons.journalIcon className="h-12 w-12" />
                          </div>
                          <div className="h-28 rounded border-2 border-black dark:border-white flex items-center justify-center bg-accent/10">
                            <Icons.reflect className="h-12 w-12" />
                          </div>
                          <div className="h-28 rounded border-2 border-black dark:border-white flex items-center justify-center bg-accent/10">
                            <Icons.brain className="h-12 w-12" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Secondary floating UI elements for depth */}
                  <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-lg border-2 border-black dark:border-white bg-accent rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                    <div className="absolute inset-2 bg-white dark:bg-black rounded flex items-center justify-center">
                      <Icons.brain className="h-16 w-16" />
                    </div>
                  </div>
                  <div className="absolute -top-14 -left-6 w-32 h-32 rounded-lg border-2 border-black dark:border-white bg-white dark:bg-black -rotate-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] z-10">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                      <div className="w-full h-2 bg-accent mb-2"></div>
                      <div className="w-full h-2 bg-accent mb-2"></div>
                      <div className="w-3/4 h-2 bg-accent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ClientAnimatedWrapper>

        {/* Load remaining sections dynamically with proper height placeholders */}
        <Suspense fallback={<div className="w-full py-12 min-h-[400px] bg-background/50"></div>}>
          <FeaturesSection />
        </Suspense>
        
        <Suspense fallback={<div className="w-full py-12 min-h-[400px] bg-background/50"></div>}>
          <HowItWorksSection />
        </Suspense>
        
        <Suspense fallback={<div className="w-full py-12 min-h-[400px] bg-background/50"></div>}>
          <GetInvolvedSection />
        </Suspense>
      </main>

      <footer className="border-t-2 border-black dark:border-white py-12 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-6 uppercase">MindSync</h3>
              <div className="flex items-center gap-3 mb-6">
                <Icons.logo className="h-8 w-8" />
                <span className="font-bold uppercase tracking-wide">MindSync</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A personal productivity app to organize thoughts, manage tasks, and reflect.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 uppercase">Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-accent transition-colors">How It Works</Link>
                </li>
                <li>
                  <Link href="#get-involved" className="hover:text-accent transition-colors">Get Involved</Link>
                </li>
                <li>
                  <Link href="https://github.com" className="hover:text-accent transition-colors">GitHub</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 uppercase">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-accent transition-colors">Cookie Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6 uppercase">Connect</h3>
              <div className="flex gap-4">
                <Link href="https://github.com/etherealo9/MindSync" className="bg-foreground text-background p-2 rounded-full hover:bg-accent hover:text-foreground transition-colors">
                  <Icons.github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="#" className="bg-foreground text-background p-2 rounded-full hover:bg-accent hover:text-foreground transition-colors">
                  <Icons.activity className="h-5 w-5" />
                  <span className="sr-only">Social</span>
                </Link>
                <Link href="#" className="bg-foreground text-background p-2 rounded-full hover:bg-accent hover:text-foreground transition-colors">
                  <Icons.message className="h-5 w-5" />
                  <span className="sr-only">Contact</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-8 border-t border-black dark:border-white">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} MindSync. All rights reserved.
            </p>
            <div className="mt-4 sm:mt-0">
              <Button variant="outline" size="sm" className="border border-foreground/20 text-xs">
                Made with <Icons.heart className="h-3 w-3 mx-1 text-red-500" /> for productivity
              </Button>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Install App Bubble */}
      <PWARegister />
    </div>
  );
}
