import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For small teams getting started with award events.",
    features: [
      "10 candidates",
      "1 award event",
      "Basic analytics",
      "Email support",
      "Public voting pages",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For organizations running multiple award programs.",
    features: [
      "Unlimited candidates",
      "Unlimited events",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Vote schedule control",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large-scale award ceremonies and events.",
    features: [
      "Everything in Pro",
      "API access",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="bg-secondary px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-normal uppercase tracking-widest text-primary">
            PRICING
          </p>
          <h2 className="mb-4 text-4xl font-light text-foreground lg:text-5xl">
            Plans that fit
            <br />
            <span className="font-normal text-primary">your needs</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-muted-foreground">
            Choose the plan that works best for your award event.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 transition-all hover:shadow-md ${
                plan.popular
                  ? "border-teal shadow-lg shadow-teal/10"
                  : "border-border/50"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal px-3 py-0.5 text-xs font-medium text-white">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <p className="text-lg font-normal text-foreground">
                  {plan.name}
                </p>
                <div className="mt-2">
                  <span className="text-4xl font-semibold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm font-light text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm font-light text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check size={16} className="shrink-0 text-teal" />
                    <span className="text-sm font-light text-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`mt-8 w-full ${plan.popular ? "bg-teal hover:bg-teal/90" : ""}`}
                variant={plan.popular ? "default" : "outline"}
                render={<Link to="/signup" />}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
