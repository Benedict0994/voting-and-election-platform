import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "This platform transformed how we run our annual awards. The dashboard is intuitive and the public voting pages are beautiful.",
    name: "Benedict Asumadu Nkrumah",
    role: "Event Director",
    org: "University Awards Committee",
    initials: "SJ",
  },
  {
    quote:
      "Setting up our corporate recognition program was a breeze. The real-time vote tracking keeps everyone engaged throughout the process.",
    name: "MaCARTHUR Kelvin",
    role: "HR Manager",
    org: "Tech Industries",
    initials: "MC",
  },
  {
    quote:
      "We switched from manual spreadsheets to this system and haven't looked back. The category comparison charts are a game-changer.",
    name: "Amara Osei",
    role: "Program Coordinator",
    org: "Community Arts Foundation",
    initials: "AO",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-normal uppercase tracking-widest text-teal">
            TESTIMONIALS
          </p>
          <h2 className="mb-4 text-4xl font-light text-foreground lg:text-5xl">
            What award organizers
            <br />
            <span className="font-normal text-teal">are saying</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-border/50 bg-white p-6 transition-all hover:border-teal/30 hover:shadow-md"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    size={16}
                    className="fill-orange-light text-orange-light"
                  />
                ))}
              </div>
              <p className="text-base font-light leading-7 text-muted-foreground">
                "{t.quote}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-teal/10 text-sm font-medium text-teal">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs font-light text-muted-foreground">
                    {t.role}, {t.org}
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
