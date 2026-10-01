import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-orange-light px-8 py-16 text-center text-white sm:px-16"
        >
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-[100px]" />

          <div className="relative">
            <h2 className="text-4xl font-light tracking-tight lg:text-5xl">
              Ready to run your
              <br />
              <span className="font-normal">next award?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-light text-white/80">
              Join hundreds of organizations already using AwardVote to manage
              their award ceremonies with confidence.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 bg-white text-primary hover:bg-white/90"
              render={<Link to="/signup" />}
            >
              Get Started Free
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
