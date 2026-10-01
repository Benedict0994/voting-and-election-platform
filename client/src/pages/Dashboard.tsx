import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import API from "../services/api";
import type { Candidate, Settings } from "../types";
import VoteChart from "../components/charts/VoteChart";
import { Users, BarChart3, Eye, EyeOff, Clock3, ArrowUpRight, Plus, Settings2, Activity, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { try {
    const [candidateRes, settingsRes] = await Promise.all([API.get("/candidates"), API.get("/settings")]);
    const payload = candidateRes.data;
    setCandidates(Array.isArray(payload) ? payload : Array.isArray(payload?.candidates) ? payload.candidates : []);
    setSettings(settingsRes.data?.settings ?? settingsRes.data);
  } catch (e) { console.error(e); } finally { setLoading(false); } })(); }, []);

  const totalVotes = useMemo(() => candidates.reduce((sum, c) => sum + Number(c.votes || 0), 0), [candidates]);
  const ranked = useMemo(() => [...candidates].sort((a,b) => Number(b.votes||0)-Number(a.votes||0)), [candidates]);
  const topCandidate = ranked[0] || null;
  const categories = useMemo(() => new Set(candidates.map(c => c.category).filter(Boolean)).size, [candidates]);
  const votingStatus = useMemo(() => { if (!settings?.votingStart || !settings?.votingEnd) return "Not configured"; const now=new Date(), start=new Date(settings.votingStart), end=new Date(settings.votingEnd); return now<start?"Upcoming":now>end?"Ended":"Live"; }, [settings]);

  if (loading) return <DashboardLayout><div className="mx-auto max-w-7xl animate-pulse space-y-5"><div className="h-28 rounded-3xl bg-white"/><div className="grid gap-4 md:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-32 rounded-2xl bg-white"/>)}</div></div></DashboardLayout>;

  const statCards = [
    {label:"Total votes",value:totalVotes.toLocaleString(),icon:BarChart3,helper:"Verified votes recorded"},
    {label:"Candidates",value:candidates.length.toLocaleString(),icon:Users,helper:`Across ${categories} categories`},
    {label:"Election status",value:votingStatus,icon:Activity,helper:votingStatus==="Live"?"Voting is currently open":"Check election schedule"},
    {label:"Results visibility",value:settings?.candidateCanViewVotes?"Visible":"Hidden",icon:settings?.candidateCanViewVotes?Eye:EyeOff,helper:"Public vote totals"},
  ];

  return <DashboardLayout><div className="mx-auto max-w-[1500px] space-y-6">
    <section className="relative overflow-hidden rounded-3xl bg-[#11152b] p-6 text-white soft-shadow sm:p-8">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl"/><div className="absolute right-40 top-16 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl"/>
      <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-violet-200"><span className={`h-2 w-2 rounded-full ${votingStatus==="Live"?"bg-emerald-400":"bg-amber-400"}`}/>{votingStatus} election</div><h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Your election, at a glance.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Monitor participation, manage candidates and keep your voting experience running smoothly.</p></div>
      <div className="flex flex-wrap gap-2"><Link to="/settings" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"><Settings2 size={16}/>Election settings</Link><Link to="/candidates/add" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#11152b] hover:bg-violet-50"><Plus size={16}/>Add candidate</Link></div></div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{statCards.map(({label,value,icon:Icon,helper})=><div key={label} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-primary"><Icon size={19}/></div></div><p className="mt-4 text-xs text-slate-400">{helper}</p></div>)}</section>

    <section className="grid gap-6 xl:grid-cols-[1.6fr_.8fr]">
      <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"><div className="mb-6 flex items-center justify-between"><div><p className="font-bold text-slate-900">Voting activity</p><p className="mt-1 text-sm text-slate-500">Vote movement for the current leading candidate.</p></div>{topCandidate&&<span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-primary">{topCandidate.name}</span>}</div>{topCandidate?<VoteChart data={topCandidate.voteHistory}/>:<div className="grid h-64 place-items-center rounded-2xl border border-dashed bg-slate-50 text-sm text-slate-400">Voting activity will appear here.</div>}</div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"><div className="mb-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600"><Clock3 size={18}/></div><div><p className="font-bold">Election timeline</p><p className="text-xs text-slate-500">Configured voting window</p></div></div><div className="space-y-3"><div className="rounded-xl bg-slate-50 p-4"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Opens</p><p className="mt-1 text-sm font-semibold">{settings?.votingStart?new Date(settings.votingStart).toLocaleString():"Not configured"}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Closes</p><p className="mt-1 text-sm font-semibold">{settings?.votingEnd?new Date(settings.votingEnd).toLocaleString():"Not configured"}</p></div></div></div>
    </section>

    <section className="rounded-2xl border bg-white shadow-sm"><div className="flex items-center justify-between border-b p-5 sm:p-6"><div><p className="font-bold">Candidate leaderboard</p><p className="mt-1 text-sm text-slate-500">Current standings across your election.</p></div><Link to="/candidates" className="flex items-center gap-1 text-sm font-semibold text-primary">Manage <ArrowUpRight size={15}/></Link></div><div className="divide-y">{ranked.length?ranked.slice(0,8).map((c,i)=><div key={c._id} className="flex items-center gap-4 px-5 py-4 sm:px-6"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${i===0?"bg-amber-50 text-amber-600":"bg-slate-100 text-slate-500"}`}>{i===0?<Trophy size={16}/>:i+1}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{c.name}</p><p className="truncate text-xs text-slate-500">{c.category}{c.department?` · ${c.department}`:""}</p></div><div className="text-right"><p className="text-sm font-bold">{Number(c.votes||0).toLocaleString()}</p><p className="text-[11px] text-slate-400">votes</p></div></div>):<div className="p-10 text-center text-sm text-slate-400">No candidates have been added yet.</div>}</div></section>
  </div></DashboardLayout>;
}
