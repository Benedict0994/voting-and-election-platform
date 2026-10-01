import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  UserCircle,
  LogOut,
  Vote,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/context/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

interface Props {
  onNavigate?: () => void;
  onClose?: () => void;
  layout?: "vertical" | "horizontal";
}

export default function Sidebar({ onNavigate, onClose, layout = "vertical" }: Props) {
  const { logoutUser, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  // Vertical layout for desktop
  if (layout === "vertical") {
    return (
      <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Vote size={18} />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">AwardVote</h1>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <Separator />

        <div className="px-4 py-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user?.name || "Admin"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.to;

            return (
              <Button
                key={link.to}
                variant={active ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  active ? "font-semibold" : "font-normal"
                }`}
                render={<Link to={link.to} onClick={onNavigate} />}
              >
                <Icon size={16} />
                {link.label}
              </Button>
            );
          })}
        </nav>

        <Separator />

        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Horizontal layout for mobile
  return (
    <div className="flex h-20 items-center justify-between gap-2 bg-sidebar px-4 py-3 text-sidebar-foreground">
      {/* Navigation items */}
      <nav className="flex flex-1 items-center justify-center gap-8">
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className="flex flex-col items-center gap-1 rounded-lg p-2 transition-colors"
            >
              <Icon
                size={24}
                className={`${
                  active
                    ? "text-primary"
                    : "text-sidebar-foreground hover:text-primary"
                }`}
              />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile section */}
      <div className="flex items-center gap-3 rounded-full bg-muted/50 px-3 py-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col sm:flex">
          <p className="text-xs font-medium">{user?.name || "Admin"}</p>
        </div>
      </div>

      {/* Logout button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut size={18} />
      </Button>

      {/* Close button */}
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-sidebar-foreground hover:bg-muted"
        >
          <X size={18} />
        </Button>
      )}
    </div>
  );
}
