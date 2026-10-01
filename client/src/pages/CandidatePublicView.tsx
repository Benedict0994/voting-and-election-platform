import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Search, ShieldCheck, Sparkles, Trophy, Vote } from "lucide-react";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import { getImageUrl } from "../utils/getImageUrl";
import CategoryComparisonChart from "../components/charts/ComparisonChart";

export default function CandidatePublicView() {
  const { slug } = useParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [categoryCandidates, setCategoryCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [votingFor, setVotingFor] = useState<string | null>(null);
  const [voteMessage, setVoteMessage] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/candidates/public/${slug}`);
        setCandidate(res.data.candidate);
        setCategoryCandidates(Array.isArray(res.data.categoryCandidates) ? res.data.categoryCandidates : []);
        setSettings(res.data.settings);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    })();
  }, [slug]);

  const now = new Date();
  const start = settings?.votingStart ? new Date(settings.votingStart) : null;
  const end = settings?.votingEnd ? new Date(settings.votingEnd) : null;
  const votingActive = !!(start && end && now >= start && now <= end);
  const filtered = useMemo(() => categoryCandidates.filter(item => `${item.name} ${item.department}`.toLowerCase().includes(query.toLowerCase())), [categoryCandidates, query]);

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
      setCategoryCandidates(items => items.map(item => item._id === candidateId && typeof total === "number" ? { ...item, votes: total } : item));
      setVoteMessage("Your vote has been counted. Thank you for supporting your nominee.");
    } catch (error: any) { setVoteMessage(error?.response?.data?.message || "Your vote could not be recorded."); }
    finally { setVotingFor(null); }
  }

  if (loading) return <div className="grid min-h-screen place-items-center bg-[#f7f5f0]"><div className="text-center"><div className="mx-auto grid h-14 w-14 animate-pulse place-items-center rounded-full bg-[#f4b41a] text-[#101828]"><Trophy size={24}/></div><p className="mt-4 text-sm font-medium text-slate-500">Loading the ballot...</p></div></div>;
  if (!candidate) return <div className="grid min-h-screen place-items-center bg-[#f7f5f0] px-4"><div className="max-w-md text-center"><Trophy className="mx-auto text-[#d9a313]" size={38}/><h1 className="mt-5 text-3xl font-black text-[#101828]">Nominee not found</h1><p className="mt-3 text-slate-500">This voting link is unavailable or no longer exists.</p><Link to="/" className="mt-6 inline-flex items-center gap-2 font-bold text-[#8a6410]"><ArrowLeft size={16}/>Return home</Link></div></div>;

  return <div className="min-h-screen bg-[#f7f5f0] text-[#101828]">
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#0b1220]/95 text-white backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full border border-[#f4b41a]/40 bg-[#f4b41a] text-[#0b1220]"><Trophy size={19}/></div><div><p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#f4b41a]">AwardVote</p><p className="text-sm font-black tracking-tight">Official Voting Portal</p></div></Link>
        <div className="hidden items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-300 md:flex"><span className="text-white">Nominees</span><span>Categories</span><span>Results</span><span>About</span></div>
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"><ArrowLeft size={14}/><span className="hidden sm:inline">Exit voting</span></Link>
      </div>
    </header>

    <section className="relative overflow-hidden bg-[#0b1220] text-white">
      <div className="absolute inset-0 award-grid opacity-20"/><div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-[#f4b41a]/10 blur-3xl"/>
      <div className="relative mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-4xl"><div className="mb-5 flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${votingActive?"bg-emerald-400 text-emerald-950":"bg-[#f4b41a] text-[#0b1220]"}`}><span className={`h-2 w-2 rounded-full ${votingActive?"bg-emerald-900":"bg-[#0b1220]"}`}/>{votingActive?"Voting now open":"Voting currently closed"}</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300">Official category ballot</span></div>
            <p className="text-xs font-black uppercase tracking-[.3em] text-[#f4b41a]">{candidate.department || "Annual Awards"}</p><h1 className="mt-3 max-w-4xl text-4xl font-black leading-[.98] tracking-[-.04em] sm:text-6xl lg:text-7xl">{candidate.category}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Meet the official nominees. Review the candidates and cast your vote for the person you want to see take home the award.</p>
          </div>
          <div className="grid min-w-[280px] grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[.04]"><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Nominees</p><p className="mt-2 text-3xl font-black">{categoryCandidates.length}</p></div><div className="border-l border-white/10 p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ballot</p><p className="mt-2 flex items-center gap-2 text-sm font-black"><ShieldCheck size={17} className="text-emerald-400"/>Secure</p></div></div>
        </div>
      </div>
    </section>

    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <section className="-mt-14 relative z-10 mb-10 grid overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl shadow-slate-900/5 sm:grid-cols-3">
        <div className="flex items-center gap-4 p-5 sm:p-6"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff7dd] text-[#9b7009]"><CalendarDays size={19}/></div><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Voting opens</p><p className="mt-1 text-xs font-bold sm:text-sm">{start?start.toLocaleString():"To be announced"}</p></div></div>
        <div className="flex items-center gap-4 border-y border-black/5 p-5 sm:border-x sm:border-y-0 sm:p-6"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#fff7dd] text-[#9b7009]"><Clock3 size={19}/></div><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Voting closes</p><p className="mt-1 text-xs font-bold sm:text-sm">{end?end.toLocaleString():"To be announced"}</p></div></div>
        <div className="flex items-center gap-4 p-5 sm:p-6"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><ShieldCheck size={19}/></div><div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Voting integrity</p><p className="mt-1 text-xs font-bold sm:text-sm">Verified transaction ledger</p></div></div>
      </section>

      {voteMessage && <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-900"><CheckCircle2 size={19}/>{voteMessage}</div>}

      <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="flex items-center gap-2 text-[#9b7009]"><Sparkles size={15}/><p className="text-[11px] font-black uppercase tracking-[.2em]">Official nominees</p></div><h2 className="mt-2 text-3xl font-black tracking-[-.03em]">Choose your favourite.</h2><p className="mt-2 text-sm text-slate-500">One ballot. One choice. Make it count.</p></div><div className="flex w-full items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-3 shadow-sm md:max-w-sm"><Search size={16} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a nominee..." className="w-full bg-transparent text-sm outline-none"/></div></div>

      <section className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item,index)=><article key={item._id} className="group overflow-hidden rounded-[22px] bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/10">
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-200"><img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"/><div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"/><span className="absolute left-4 top-4 grid h-9 min-w-9 place-items-center rounded-full border border-white/30 bg-black/35 px-2 text-xs font-black text-white backdrop-blur-md">{String(index+1).padStart(2,"0")}</span>{item.slug===candidate.slug&&<span className="absolute right-4 top-4 rounded-full bg-[#f4b41a] px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#0b1220]">Featured nominee</span>}<div className="absolute bottom-4 left-4 right-4 text-white"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#f4d46a]">{item.department || item.category}</p><h3 className="mt-1 text-2xl font-black leading-tight tracking-tight">{item.name}</h3></div></div>
          <div className="p-4"><div className="mb-4 flex items-center justify-between">{settings?.candidateCanViewVotes?<div><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Current votes</p><p className="mt-0.5 text-lg font-black">{Number(item.votes||0).toLocaleString()}</p></div>:<div><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Vote count</p><p className="mt-1 text-xs font-bold text-slate-500">Results hidden</p></div>}<div className="rounded-full bg-[#f7f5f0] px-3 py-1.5 text-[10px] font-black text-slate-500">NOMINEE {String(index+1).padStart(2,"0")}</div></div>
            {item.bio&&<p className="mb-4 line-clamp-2 text-xs leading-5 text-slate-500">{item.bio}</p>}<button disabled={!votingActive||votingFor!==null} onClick={()=>handleVote(item._id)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b1220] px-4 py-3.5 text-xs font-black uppercase tracking-[.12em] text-white transition hover:bg-[#d9a313] hover:text-[#0b1220] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"><Vote size={15}/>{votingFor===item._id?"Casting vote...":votingActive?"Vote now":"Voting closed"}</button></div>
        </article>)}
      </section>

      {filtered.length===0&&<div className="my-16 text-center"><Search className="mx-auto text-slate-300"/><p className="mt-3 font-bold">No nominee matches your search.</p></div>}

      {settings?.candidateCanViewVotes&&<section className="mt-14 overflow-hidden rounded-[24px] border border-black/5 bg-white p-5 shadow-sm sm:p-8"><div className="mb-7 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#9b7009]">Live standings</p><h2 className="mt-2 text-2xl font-black">Category performance</h2></div><span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase text-emerald-700 sm:inline">Live data</span></div><CategoryComparisonChart candidates={categoryCandidates}/></section>}
    </main>

    <footer className="mt-12 bg-[#0b1220] text-white"><div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#f4b41a] text-[#0b1220]"><Trophy size={16}/></div><div><p className="text-xs font-black">AwardVote</p><p className="text-[10px] text-slate-500">Official digital voting portal</p></div></div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-slate-500">Secure voting • Transparent records • Trusted results</p></div></footer>
  </div>;
}
