import { motion } from "motion/react";
import { LayoutDashboard, Globe, TrendingUp } from "lucide-react";

const tools = [
  {
    icon: <LayoutDashboard size={20} />,
    label: "Admin Dashboard",
    tag: "Dashboard",
    desc: "Get a complete overview of candidates, vote counts, election status, and performance charts. Manage everything from one powerful interface.",
  },
  {
    icon: <Globe size={20} />,
    label: "Public Candidate Profiles",
    tag: "Public Pages",
    desc: "Each candidate gets a beautiful public profile page that voters can browse. Share unique links with your audience to drive engagement.",
  },
  {
    icon: <TrendingUp size={20} />,
    label: "Analytics & Charts",
    tag: "Analytics",
    desc: "Track vote progression over time with interactive charts. Compare candidates within categories and identify trends in real-time.",
  },
];

export default function ToolsSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-normal uppercase tracking-widest text-teal">
            POWERFUL TOOLS
          </p>
          <h2 className="mb-4 text-4xl font-light text-foreground lg:text-5xl">
            Built for
            <br />
            <span className="font-normal text-teal">award organizers</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            Features that eliminate complexity and let you focus on what matters
            — running a successful award ceremony.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {tools.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border/50 bg-white p-6 transition-all hover:border-teal/30 hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white">
                    {t.icon}
                  </div>
                  <span className="rounded-full bg-orange-light/10 px-2.5 py-0.5 text-xs font-normal text-orange-light">
                    {t.tag}
                  </span>
                </div>
                <div>
                  <p className="mb-1 text-base font-normal text-foreground">
                    {t.label}
                  </p>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">
                    {t.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
