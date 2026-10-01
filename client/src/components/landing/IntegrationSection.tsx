import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Sign Up & Create Your Space",
    desc: "Register your admin account and set up your unique award space in seconds.",
    dotColor: "#066d6d",
  },
  {
    number: "02",
    title: "Add Your Candidates",
    desc: "Create candidate profiles with photos, bios, categories, and departments.",
    dotColor: "#f16722",
  },
  {
    number: "03",
    title: "Share the Voting Link",
    desc: "Share public candidate profile pages with your audience to start collecting votes.",
    dotColor: "#ffa046",
  },
  {
    number: "04",
    title: "Track Results Live",
    desc: "Monitor vote progress, rankings, and analytics from your admin dashboard.",
    dotColor: "#066d6d",
  },
];

export default function IntegrationSection() {
  return (
    <section id="how-it-works" className="bg-secondary px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-16 lg:grid-cols-2">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <p className="mb-3 text-xs font-normal uppercase tracking-widest text-teal">
              THE FLOW
            </p>
            <h2 className="mb-2 text-4xl font-light leading-tight text-foreground lg:text-5xl">
              HOW IT
              <br />
              <span className="font-normal text-teal">WORKS.</span>
            </h2>
            <div className="mb-6 h-1 w-12 rounded-full bg-teal" />
            <p className="max-w-sm text-base font-light leading-relaxed text-muted-foreground">
              A streamlined process designed to get your award election running
              in minutes. Simple, powerful, and ridiculously easy.
            </p>
          </motion.div>

          {/* Right — timeline */}
          <div className="relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex gap-8 pb-14 last:pb-0"
              >
                <div className="flex flex-col items-center">
                  <div
                    className="z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: step.dotColor }}
                  />
                  {i < steps.length - 1 && (
                    <div className="mt-1 w-px flex-1 bg-border" />
                  )}
                </div>

                <div className="-mt-1 flex gap-5">
                  <span
                    className="shrink-0 select-none text-6xl font-light leading-none"
                    style={{ color: step.dotColor + "20" }}
                  >
                    {step.number}
                  </span>
                  <div className="pt-1">
                    <h3 className="mb-1.5 text-lg font-normal tracking-wide text-foreground">
                      {step.title}
                    </h3>
                    <p className="max-w-xs text-sm font-light leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
