import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Mail, LockKeyhole, Trophy, Vote } from "lucide-react";
import API from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    awardName: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!formData.awardName.trim()) {
      toast.error("Award name is required");
      return;
    }

    setLoading(true);

    try {
      console.log("Sending form data:", formData);
      const res = await API.post("/auth/signup", formData);
      toast.success("Signup successful! Please verify your email.");
      // Redirect to verification page with adminId and email
      navigate("/verify-email", {
        state: {
          adminId: res.data.adminId,
          email: res.data.email,
        },
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — form */}
      <div className="flex flex-1 flex-col justify-between bg-secondary px-6 py-8 sm:px-12 lg:px-20">
        <div>
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Vote size={18} />
            </div>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Get Started Now
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your admin account to manage awards
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  className="h-11 rounded-xl border-border bg-white pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-foreground">
                Email address
              </Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-11 rounded-xl border-border bg-white pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-foreground">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="min 8 chars"
                  className="h-11 rounded-xl border-border bg-white pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="awardName" className="text-sm text-foreground">
                Award Name
              </Label>
              <div className="relative">
                <Trophy
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="awardName"
                  name="awardName"
                  placeholder="e.g. Best Employee Awards"
                  className="h-11 rounded-xl border-border bg-white pl-10"
                  value={formData.awardName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-xl text-sm"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AwardVote, All rights reserved
        </p>
      </div>

      {/* Right — full image */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80&auto=format&fit=crop"
          alt="Smiling person"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <h2 className="max-w-md text-3xl font-light leading-tight text-white">
            The simplest way to{" "}
            <span className="font-normal">run your elections</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm font-light text-white/70">
            Set up your award space and start managing candidates in seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
