import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, CheckCircle, Vote } from "lucide-react";
import API from "../services/api";
import useAuth from "../context/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(0);

  const adminId = location.state?.adminId;
  const email = location.state?.email;

  useEffect(() => {
    // Redirect to signup if no adminId or email
    if (!adminId || !email) {
      navigate("/signup");
      return;
    }
  }, [adminId, email, navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !canResend && email) {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, canResend, email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!otp || otp.length !== 5) {
        toast.error("Please enter a valid 5-digit OTP");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/verify-otp", {
        adminId,
        otp,
      });

      loginUser(res.data.user, res.data.token);
      toast.success("Email verified successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);

    try {
      await API.post("/auth/resend-otp", {
        adminId,
      });

      toast.success("OTP resent to your email");
      setTimer(60);
      setCanResend(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }

  if (!adminId || !email) {
    return null;
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
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-center">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            We've sent a 5-digit OTP to <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm text-foreground">
                Verification Code
              </Label>
              <div className="relative">
                <CheckCircle
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  id="otp"
                  name="otp"
                  placeholder="Enter 5-digit code"
                  maxLength={5}
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  className="h-11 rounded-xl border-border bg-white pl-10 text-center text-2xl letter-spacing-wide"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 5))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Check your email for the OTP code. It will expire in 10 minutes.
              </p>
            </div>

            <Button
              type="submit"
              className="h-11 w-full rounded-xl text-sm"
              disabled={loading || otp.length !== 5}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            {canResend ? (
              <Button
                type="button"
                variant="ghost"
                className="text-primary hover:underline mt-2"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? "Resending..." : "Resend OTP"}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Resend available in {timer}s
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Made a mistake?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Go back
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
          <div className="rounded-2xl bg-black/40 p-6 text-white backdrop-blur-sm">
            <p className="text-lg font-semibold">Secure Verification</p>
            <p className="mt-2 text-sm opacity-90">
              We take your security seriously. Email verification helps protect your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
