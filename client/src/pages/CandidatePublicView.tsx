import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Vote, ArrowLeft } from "lucide-react";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import { getImageUrl } from "../utils/getImageUrl";
import CategoryComparisonChart from "../components/charts/ComparisonChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CandidatePublicView() {
  const { slug } = useParams();

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [categoryCandidates, setCategoryCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [votingFor, setVotingFor] = useState<string | null>(null);
  const [voteMessage, setVoteMessage] = useState("");

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const res = await API.get(`/candidates/public/${slug}`);
        setCandidate(res.data.candidate);
        setCategoryCandidates(res.data.categoryCandidates || []);
        setSettings(res.data.settings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidate();
  }, [slug]);

  const now = new Date();
  const votingStart = settings?.votingStart ? new Date(settings.votingStart) : null;
  const votingEnd = settings?.votingEnd ? new Date(settings.votingEnd) : null;
  const votingActive = votingStart && votingEnd ? now >= votingStart && now <= votingEnd : false;

  function getVoterToken() {
    const key = "awardvote_voter_token";
    let token = localStorage.getItem(key);
    if (!token) { token = crypto.randomUUID(); localStorage.setItem(key, token); }
    return token;
  }

  async function handleVote(candidateId: string) {
    setVotingFor(candidateId); setVoteMessage("");
    try {
      const res = await API.post("/votes", { candidateId, voterToken: getVoterToken() });
      const total = res.data?.vote?.total_votes;
      setCategoryCandidates((items) => items.map((item) => item._id === candidateId && typeof total === "number" ? { ...item, votes: total } : item));
      setVoteMessage("Your vote has been recorded successfully.");
    } catch (error: any) {
      setVoteMessage(error?.response?.data?.message || "Your vote could not be recorded.");
    } finally { setVotingFor(null); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              Loading candidates...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardContent className="p-10 text-center">
              <h1 className="text-2xl font-semibold">Candidate not found</h1>
              <p className="mt-2 text-muted-foreground">
                The candidate you are trying to view does not exist.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Public navbar */}
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Vote size={16} />
            </div>
            <span className="text-sm font-semibold">AwardVote</span>
          </Link>
          <Button variant="ghost" size="sm" render={<Link to="/" />}>
            <ArrowLeft size={14} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Award Category
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {candidate.category}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Candidates competing in the same award category appear below.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Total Candidates</p>
              <p className="mt-1 text-3xl font-semibold">{categoryCandidates.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Voting Status</p>
              <p className={`mt-1 text-2xl font-semibold ${votingActive ? "text-emerald-600" : "text-amber-600"}`}>
                {votingActive ? "Active" : "Not Active"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Voting Start</p>
              <p className="mt-1 text-sm font-semibold">
                {settings?.votingStart ? new Date(settings.votingStart).toLocaleString() : "Not set"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-medium text-muted-foreground">Voting End</p>
              <p className="mt-1 text-sm font-semibold">
                {settings?.votingEnd ? new Date(settings.votingEnd).toLocaleString() : "Not set"}
              </p>
            </CardContent>
          </Card>
        </div>

        {voteMessage && <Card><CardContent className="p-4 text-center text-sm font-medium">{voteMessage}</CardContent></Card>}

        {/* Candidate cards */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {categoryCandidates.map((item) => (
            <Card
              key={item._id}
              className={`group overflow-hidden transition-shadow hover:shadow-md ${
                item.slug === candidate.slug ? "border-primary ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {item.slug === candidate.slug && (
                  <Badge className="absolute left-3 top-3">Current Candidate</Badge>
                )}
              </div>

              <CardContent className="space-y-4 p-5">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.department}</p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Votes
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {settings?.candidateCanViewVotes ? item.votes : "--"}
                  </p>
                </div>

                <Button className="w-full" disabled={!votingActive || votingFor !== null} onClick={() => handleVote(item._id)}>
                  <Vote size={16} className="mr-2" />
                  {votingFor === item._id ? "Recording Vote..." : votingActive ? "Vote for this Candidate" : "Voting Not Active"}
                </Button>

                {item.bio && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm leading-6 text-muted-foreground">{item.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart or hidden notice */}
        {settings?.candidateCanViewVotes ? (
          <Card>
            <CardHeader>
              <CardTitle>Category Comparison Graph</CardTitle>
              <CardDescription>
                Compare vote progress for all candidates in this category over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryComparisonChart candidates={categoryCandidates} />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <h2 className="font-semibold text-amber-800">
                Vote visibility is currently hidden
              </h2>
              <p className="mt-2 text-sm text-amber-700">
                Candidate cards are visible, but vote totals and graphs are currently hidden.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
