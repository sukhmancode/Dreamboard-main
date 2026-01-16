"use client";
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pencil, Users, Zap, ArrowRight, Play, Download } from "lucide-react"
import { SignInDialog } from "./components/AuthPage"
import { useEffect } from "react"
import { useRouter } from "next/navigation";

export default function ExcalidrawLanding() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) {
      return;
    }
    else {
      router.push("/dashboard")
    }
  },[router])
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Pencil className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-balance">ExcaliDraw</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#collaboration" className="text-muted-foreground hover:text-foreground transition-colors">
            Collaboration
          </a>
          <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-3">
          <SignInDialog/>
          <Button size="sm" className="gradient-blue text-white border-0">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                The complete platform to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  sketch ideas
                </span>
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                {
                  "Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best collaborative experiences with ExcaliDraw."
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-blue text-white border-0 text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                Get a demo
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Explore the Product
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 gradient-blue-subtle border-border/50">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Collaborative Canvas</h3>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-background" />
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-background" />
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-background" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-border/30 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Pencil className="w-8 h-8 mx-auto text-blue-400" />
                      <p className="text-sm text-muted-foreground">Draw, sketch, collaborate</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-muted/50 rounded border border-border/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="h-16 bg-muted/50 rounded border border-border/30 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="p-6 text-center gradient-blue-subtle border-border/50">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">20 days</div>
              <div className="text-sm text-muted-foreground">saved on daily builds.</div>
              <div className="text-xs font-mono text-accent">NETFLIX</div>
            </div>
          </Card>

          <Card className="p-6 text-center gradient-blue-subtle border-border/50">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">faster time to market.</div>
              <div className="text-xs font-mono text-accent">TRIPADVISOR</div>
            </div>
          </Card>

          <Card className="p-6 text-center gradient-blue-subtle border-border/50">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">300%</div>
              <div className="text-sm text-muted-foreground">increase in collaboration.</div>
              <div className="text-xs font-mono text-accent">BOX</div>
            </div>
          </Card>

          <Card className="p-6 text-center gradient-blue-subtle border-border/50">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">6x</div>
              <div className="text-sm text-muted-foreground">faster to build + deploy.</div>
              <div className="text-xs font-mono text-accent">EBAY</div>
            </div>
          </Card>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-accent">
              <Users className="w-4 h-4" />
              Collaboration
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-balance">Faster iteration. More innovation.</h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                The platform for rapid progress. Let your team focus on shipping features instead of managing
                infrastructure with automated CI/CD, built-in testing, and integrated collaboration.
              </p>
            </div>

            <Button size="lg" className="gradient-blue text-white border-0">
              <Download className="w-5 h-5 mr-2" />
              Start Building Today
            </Button>
          </div>

          <div className="relative">
            <Card className="p-6 gradient-blue-subtle border-border/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Make teamwork seamless.</h3>
                  <div className="text-xs text-accent">LIVE</div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Tools for your team and stakeholders to share feedback and iterate faster.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded border border-border/30">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-mono">collaborative-whiteboard</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded border border-border/30">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-mono">real-time-sync</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded border border-border/30">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-sm font-mono">version-control</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Pencil className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">ExcaliDraw</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
