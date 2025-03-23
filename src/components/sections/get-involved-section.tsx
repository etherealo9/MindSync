import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export default function GetInvolvedSection() {
  return (
    <>
      {/* Get Involved */}
      <section id="get-involved" className="w-full py-16 md:py-28 lg:py-32 border-b-2 border-black dark:border-white relative overflow-hidden">
        {/* Visual elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMTUiIHI9IjIiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjE1IiByPSIyIi8+PGNpcmNsZSBjeD0iMTUiIGN5PSIzMCIgcj0iMiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjMwIiByPSIyIi8+PGNpcmNsZSBjeD0iMTUiIGN5PSI0NSIgcj0iMiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNDUiIHI9IjIiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjQ1IiByPSIyIi8+PC9nPjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/30 -translate-y-1/4 blur-3xl" aria-hidden="true"></div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-6 animate-slide-up">
              <Badge variant="outline" className="px-4 py-1.5 text-sm uppercase font-bold border-2 border-black dark:border-white bg-white/50 dark:bg-black/50 backdrop-blur-sm">Open Source</Badge>
              <h2 className="text-4xl font-bold tracking-tighter uppercase sm:text-5xl md:text-6xl relative">
                Get <span className="bg-accent px-3 py-1">involved</span>
                <div className="absolute -bottom-4 left-0 w-24 h-1 bg-black dark:bg-white"></div>
              </h2>
              <p className="text-xl md:text-2xl font-medium text-foreground/70 max-w-[600px] mt-6">
                MindSync is open source and welcomes contributions from the community. 
                Help us make productivity and personal growth accessible to everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
                <Link href="https://github.com">
                  <Button size="lg" className="neo-button w-full sm:w-auto px-6 py-6 text-lg">
                    <Icons.github className="mr-3 h-5 w-5" />
                    Star on GitHub
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 px-6 py-6 text-lg">
                    <Icons.rocket className="mr-3 h-5 w-5" />
                    Try the Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="space-y-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)]">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-accent/60 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Icons.github className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mt-2">Contribute Code</h3>
                      <p className="text-foreground/70 mt-2">
                        Submit pull requests to add features or fix bugs
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="group">
                  <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)]">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-accent/60 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Icons.messageCircle className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mt-2">Report Issues</h3>
                      <p className="text-foreground/70 mt-2">
                        Help us improve by reporting bugs and suggesting features
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="group">
                  <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)]">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-accent/60 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Icons.book className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mt-2">Documentation</h3>
                      <p className="text-foreground/70 mt-2">
                        Improve our docs to help onboard new users
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="group">
                  <Card className="border-2 border-black dark:border-white overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.7)]">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center bg-accent/60 mb-4 transition-transform duration-300 group-hover:scale-110">
                        <Icons.star className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold mt-2">Spread the Word</h3>
                      <p className="text-foreground/70 mt-2">
                        Share MindSync with your network
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Completely redesigned */}
      <section className="w-full py-20 md:py-32 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%)] bg-[length:20px_20px]" aria-hidden="true"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10" aria-hidden="true"></div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="absolute -top-16 -right-16 w-32 h-32 border-2 border-black dark:border-white rotate-12" aria-hidden="true"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 border-2 border-black dark:border-white -rotate-12" aria-hidden="true"></div>
          
          <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-3xl mx-auto">
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-4xl font-bold tracking-tighter uppercase sm:text-5xl md:text-6xl text-black">
                Ready to get started?
              </h2>
              <p className="text-xl md:text-2xl font-medium text-black/80">
                Join the community of developers and users building the future of personal productivity.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto animate-slide-up">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-black text-white hover:bg-black/80 transition-colors border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
                  Start Using MindSync
                  <Icons.arrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-white/80 backdrop-blur-sm text-black border-2 border-black hover:bg-white transition-colors shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]">
                  <Icons.github className="mr-3 h-5 w-5" />
                  View on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 