import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Settings as SettingsIcon, UserCircle, LogOut, Vote, Plus, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuth from "@/context/useAuth";

const links = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/settings", label: "Election settings", icon: SettingsIcon },
  { to: "/profile", label: "Account", icon: UserCircle },
];

interface Props { onNavigate?: () => void; onClose?: () => void; layout?: "vertical" | "horizontal"; }

export default function Sidebar({ onNavigate, layout = "vertical" }: Props) {
  const { logoutUser, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "AV";
  const active = (path: string) => location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));
  const logout = () => { logoutUser(); navigate("/login"); };

  if (layout === "horizontal") {
    return (
      <nav className="grid h-[72px] grid-cols-4 bg-[#11152b] px-2 text-white">
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} onClick={onNavigate} className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${active(to) ? "text-[#a998ff]" : "text-slate-400"}`}>
            <Icon size={20} />
            <span>{label === "Election settings" ? "Settings" : label}</span>
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <div className="flex h-full flex-col bg-sidebar px-3 py-4 text-sidebar-foreground">
      <Link to="/dashboard" className="mb-7 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#8b76ff] to-[#5b3df5] shadow-lg shadow-violet-950/30"><Vote size={20} /></div>
        <div><div className="text-base font-bold tracking-tight">AwardVote</div><div className="text-[11px] text-slate-400">Election control center</div></div>
      </Link>

      <Link to="/candidates/add" className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-sm font-semibold text-[#11152b] transition hover:bg-violet-50">
        <Plus size={17} /> Add candidate
      </Link>

      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[.18em] text-slate-500">Workspace</p>
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} onClick={onNavigate} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active(to) ? "bg-sidebar-accent font-semibold text-white shadow-sm" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
            <Icon size={18} />{label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/[.04] p-3">
          <div className="mb-3 flex items-center gap-3">
            <Avatar className="h-9 w-9"><AvatarFallback className="bg-[#2b3153] text-xs font-bold text-white">{initials}</AvatarFallback></Avatar>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{user?.name || "Administrator"}</p><p className="truncate text-[11px] text-slate-400">{user?.email || "Election administrator"}</p></div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"><ExternalLink size={14}/> View public site</Link>
        </div>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"><LogOut size={17}/> Sign out</button>
      </div>
    </div>
  );
}
