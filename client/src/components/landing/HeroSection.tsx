import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-white py-20 sm:py-10 lg:py-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center"
          >
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              The Easiest Way to
              <br />
              <span className="text-teal">Run Elections</span> Online
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Create, manage, and track award nominations and votes with a
              powerful admin dashboard and beautiful public voting pages.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Button size="lg" render={<Link to="/signup" />}>
                Start Free Trial
                <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<a href="#how-it-works" />}
              >
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden w-[65%] lg:block"
          >
            <div className="relative rounded-2xl border bg-white p-6 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs text-muted-foreground">
                    dashboard.awardvote.com
                  </span>
                </div>
                <div className="space-y-3 rounded-xl bg-secondary p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Admin Dashboard
                    </span>
                    <span className="rounded-full bg-teal/10 px-2 py-0.5 text-xs font-medium text-teal">
                      Live
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Candidates", value: "24" },
                      { label: "Total Votes", value: "1,847" },
                      { label: "Active", value: "Yes" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg bg-white p-3 text-center shadow-sm"
                      >
                        <p className="text-lg font-semibold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {["Sarah Johnson", "Michael Chen", "Amara Osei"].map(
                      (name, i) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-teal">
                              #{i + 1}
                            </span>
                            <span className="text-sm text-foreground">
                              {name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {312 - i * 47} votes
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
