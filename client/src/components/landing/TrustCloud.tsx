import {
  GraduationCap,
  Building2,
  Heart,
  Landmark,
  Users,
  Award,
} from "lucide-react";

const orgs = [
  { icon: GraduationCap, label: "Universities" },
  { icon: Building2, label: "Corporate" },
  { icon: Heart, label: "Non-profits" },
  { icon: Landmark, label: "Government" },
  { icon: Users, label: "Associations" },
  { icon: Award, label: "Awards Bodies" },
];

export default function TrustCloud() {
  return (
    <section className="border-b bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by organizations across industries
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {orgs.map((org) => {
            const Icon = org.icon;
            return (
              <div
                key={org.label}
                className="flex items-center gap-2.5 text-muted-foreground/50 transition-colors hover:text-primary"
              >
                <Icon size={28} strokeWidth={1.5} />
                <span className="text-sm font-semibold">{org.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
