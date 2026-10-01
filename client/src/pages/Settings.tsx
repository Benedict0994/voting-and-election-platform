import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Eye, EyeOff, Save, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Settings as SettingsType } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [formData, setFormData] = useState({
    votingStart: "",
    votingEnd: "",
    candidateCanViewVotes: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await API.get("/settings");
        setSettings(res.data);
        setFormData({
          votingStart: res.data.votingStart ? res.data.votingStart.slice(0, 16) : "",
          votingEnd: res.data.votingEnd ? res.data.votingEnd.slice(0, 16) : "",
          candidateCanViewVotes: res.data.candidateCanViewVotes,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        votingStart: formData.votingStart ? new Date(formData.votingStart).toISOString() : null,
        votingEnd: formData.votingEnd ? new Date(formData.votingEnd).toISOString() : null,
        candidateCanViewVotes: formData.candidateCanViewVotes,
      };
      const res = await API.put("/settings", payload);
      setSettings(res.data);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  }

  const votingStatus = useMemo(() => {
    if (!settings?.votingStart || !settings?.votingEnd) return "Not configured";
    const now = new Date();
    const start = new Date(settings.votingStart);
    const end = new Date(settings.votingEnd);
    if (now < start) return "Not started";
    if (now > end) return "Ended";
    return "Active";
  }, [settings]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Loading settings...
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              System Control
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Control vote visibility, scheduling, and election timing.
            </p>
          </div>
          <Badge
            variant={
              votingStatus === "Active" ? "default" : votingStatus === "Ended" ? "destructive" : "secondary"
            }
          >
            {votingStatus}
          </Badge>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vote Visibility</p>
                <p className="mt-1 text-2xl font-semibold">
                  {settings?.candidateCanViewVotes ? "Visible" : "Hidden"}
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                {settings?.candidateCanViewVotes ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Time</p>
                <p className="mt-1 text-sm font-semibold">
                  {settings?.votingStart ? new Date(settings.votingStart).toLocaleDateString() : "Not set"}
                </p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <CalendarDays size={20} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">End Time</p>
                <p className="mt-1 text-sm font-semibold">
                  {settings?.votingEnd ? new Date(settings.votingEnd).toLocaleDateString() : "Not set"}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <CalendarDays size={20} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security</p>
                <p className="mt-1 text-2xl font-semibold">Protected</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <ShieldCheck size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Voting Configuration</CardTitle>
              <CardDescription>
                Set the schedule and control what candidates can see.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Voting Start Date & Time</Label>
                    <Input
                      type="datetime-local"
                      name="votingStart"
                      value={formData.votingStart}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Voting End Date & Time</Label>
                    <Input
                      type="datetime-local"
                      name="votingEnd"
                      value={formData.votingEnd}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">Candidate Vote Visibility</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Decide whether candidates can view vote totals and charts on their public page.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {formData.candidateCanViewVotes ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={formData.candidateCanViewVotes}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, candidateCanViewVotes: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" disabled={saving}>
                  <Save size={16} className="mr-2" />
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Current Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Voting Start</p>
                  <p className="mt-1 text-sm font-semibold">
                    {settings?.votingStart ? new Date(settings.votingStart).toLocaleString() : "Not set"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Voting End</p>
                  <p className="mt-1 text-sm font-semibold">
                    {settings?.votingEnd ? new Date(settings.votingEnd).toLocaleString() : "Not set"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visibility Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Candidate Access</p>
                  <p className="mt-1 text-sm font-semibold">
                    {settings?.candidateCanViewVotes
                      ? "Candidates can view votes and chart"
                      : "Candidates can only view profile information"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-5">
                <p className="text-sm font-semibold">Admin Note</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Changes affect public candidate pages immediately after saving. Ensure your
                  voting times are accurate before the election begins.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
