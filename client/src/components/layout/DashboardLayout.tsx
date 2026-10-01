import type { ReactNode } from "react";
import { Bell, Search, Vote } from "lucide-react";
import Sidebar from "./Sidebar";

interface Props { children: ReactNode; }

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] border-r border-white/5 lg:block"><Sidebar layout="vertical" /></aside>

      <header className="fixed inset-x-0 top-0 z-20 h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl lg:left-[270px]">
        <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 lg:hidden"><div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white"><Vote size={18}/></div><span className="font-bold">AwardVote</span></div>
          <div className="hidden max-w-sm flex-1 items-center gap-2 rounded-xl border bg-slate-50 px-3 py-2 text-slate-400 lg:flex"><Search size={16}/><span className="text-sm">Search candidates, settings...</span></div>
          <div className="ml-auto flex items-center gap-3"><span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline">System online</span><button className="grid h-9 w-9 place-items-center rounded-xl border bg-white text-slate-500 transition hover:bg-slate-50"><Bell size={17}/></button></div>
        </div>
      </header>

      <div className="lg:pl-[270px]">
        <main className="min-h-screen px-4 pb-24 pt-24 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 lg:hidden"><Sidebar layout="horizontal" /></div>
    </div>
  );
}
