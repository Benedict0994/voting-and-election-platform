import { motion } from "motion/react";
import {
  Users,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Clock3,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: <Users size={20} />,
    label: "Candidate Management",
    desc: "Add, edit, and manage candidate profiles with images, bios, and categories.",
  },
  {
    icon: <BarChart3 size={20} />,
    label: "Real-Time Vote Tracking",
    desc: "Monitor vote counts and progression with live charts and analytics.",
  },
  {
    icon: <ExternalLink size={20} />,
    label: "Public Voting Pages",
    desc: "Share beautiful candidate profiles with voters via unique public links.",
  },
  {
    icon: <ShieldCheck size={20} />,
    label: "Secure Admin Dashboard",
    desc: "Each admin has a private workspace with JWT-secured authentication.",
  },
  {
    icon: <Clock3 size={20} />,
    label: "Voting Schedule Control",
    desc: "Set precise start and end times for your election with ease.",
  },
  {
    icon: <Trophy size={20} />,
    label: "Category Comparison",
    desc: "Compare candidates within categories using detailed comparison charts.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-secondary px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-normal uppercase tracking-widest text-teal">
            FEATURES
          </p>
          <h2 className="mb-4 text-4xl font-light text-foreground lg:text-5xl">
            Everything you need to
            <br />
            <span className="font-normal text-teal">
              run award elections
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            Powerful tools for managing nominations, tracking votes, and sharing
            results — automatically and effortlessly.
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-border/50 bg-white p-6 transition-all hover:border-teal/30 hover:shadow-md"
            >
              <div className="flex flex-col gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white">
                  {f.icon}
                </div>
                <div>
                  <p className="mb-1 text-base font-normal text-foreground">
                    {f.label}
                  </p>
                  <p className="text-sm font-light leading-relaxed text-muted-foreground">
                    {f.desc}
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
