import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import VoteChart from "../components/charts/VoteChart";
import { Trophy, Users, BarChart3, Eye, EyeOff, Clock3 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [candidateRes, settingsRes] = await Promise.all([
          API.get("/candidates"),
          API.get("/settings"),
        ]);
        setCandidates(candidateRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalVotes = useMemo(
    () => candidates.reduce((sum, c) => sum + c.votes, 0),
    [candidates],
  );

  const topCandidate = useMemo(() => {
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => b.votes - a.votes)[0];
  }, [candidates]);

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
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">Loading dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Admin Overview
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor candidates, vote activity, and system settings.
            </p>
          </div>
          <Badge
            variant={
              votingStatus === "Active"
                ? "default"
                : votingStatus === "Ended"
                  ? "destructive"
                  : "secondary"
            }
            className="w-fit text-sm"
          >
            {votingStatus}
          </Badge>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Candidates
                </p>
                <p className="mt-1 text-3xl font-semibold">{candidates.length}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Votes
                </p>
                <p className="mt-1 text-3xl font-semibold">{totalVotes}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <BarChart3 size={20} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Vote Visibility
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {settings?.candidateCanViewVotes ? "Visible" : "Hidden"}
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                {settings?.candidateCanViewVotes ? (
                  <Eye size={20} />
                ) : (
                  <EyeOff size={20} />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Top Candidate
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {topCandidate ? topCandidate.name : "N/A"}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Trophy size={20} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart + sidebar */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Vote movement for the leading candidate.
                  </CardDescription>
                </div>
                {topCandidate && (
                  <Badge variant="secondary">{topCandidate.name}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {topCandidate ? (
                <VoteChart data={topCandidate.voteHistory} />
              ) : (
                <div className="rounded-lg bg-muted p-8 text-center text-muted-foreground">
                  No chart data available yet.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="rounded-lg bg-muted p-2">
                  <Clock3 size={18} />
                </div>
                <div>
                  <CardTitle className="text-base">Voting Timeline</CardTitle>
                  <CardDescription>Current schedule.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Start
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {settings?.votingStart
                      ? new Date(settings.votingStart).toLocaleString()
                      : "Not set"}
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    End
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {settings?.votingEnd
                      ? new Date(settings.votingEnd).toLocaleString()
                      : "Not set"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    Candidates
                  </span>
                  <span className="text-sm font-semibold">{candidates.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    Votes Counted
                  </span>
                  <span className="text-sm font-semibold">{totalVotes}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    Visibility
                  </span>
                  <span className="text-sm font-semibold">
                    {settings?.candidateCanViewVotes ? "On" : "Off"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rankings */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Rankings</CardTitle>
            <CardDescription>Sorted by current vote count.</CardDescription>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="rounded-lg bg-muted p-8 text-center text-muted-foreground">
                No candidates available yet.
              </div>
            ) : (
              <div className="space-y-3">
                {[...candidates]
                  .sort((a, b) => b.votes - a.votes)
                  .map((candidate, index) => (
                    <div
                      key={candidate._id}
                      className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-sm font-semibold">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {candidate.category} &middot; {candidate.department}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Votes
                        </p>
                        <p className="text-xl font-semibold">{candidate.votes}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
