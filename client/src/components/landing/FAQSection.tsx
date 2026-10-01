import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the voting system work?",
    answer:
      "Each admin creates their own award space with candidates. Voters access public candidate profile pages via unique links and can view candidate details. Admins track all vote activity from the dashboard.",
  },
  {
    question: "Is the voting process secure?",
    answer:
      "Yes. Admin accounts use JWT-based authentication. Each admin only has access to their own candidates and settings. All data is stored securely in MongoDB.",
  },
  {
    question: "Can I customize the voting schedule?",
    answer:
      "Absolutely. You can set precise start and end times for your election from the Settings page. Voting is only active during the scheduled window.",
  },
  {
    question: "Can candidates see their vote counts?",
    answer:
      "That's up to you. The admin can toggle vote visibility on or off from the Settings page. When hidden, candidates can see their profile but not vote totals or charts.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "The platform is fully responsive and works beautifully on all devices — phones, tablets, and desktops. No separate app download needed.",
  },
  {
    question: "Do I need a premium plan to get started?",
    answer:
      "No. The free plan lets you manage up to 10 candidates with basic analytics. You can upgrade anytime as your needs grow.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <p className="mb-3 text-xs font-normal uppercase tracking-widest text-teal">
              FAQ
            </p>
            <h2 className="mb-4 text-4xl font-light leading-tight text-foreground lg:text-5xl">
              Frequently asked
              <br />
              <span className="font-normal text-teal">questions.</span>
            </h2>
            <div className="mb-6 h-1 w-12 rounded-full bg-teal" />
            <p className="max-w-sm text-base font-light leading-relaxed text-muted-foreground">
              Can't find what you're looking for? Reach out to our support team
              and we'll get back to you.
            </p>
            <Button className="mt-6" render={<Link to="/signup" />}>
              Get Started
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion className="space-y-0">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-normal text-foreground">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm font-light leading-7 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
