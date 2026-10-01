import { useState } from "react";
import type { ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop left sidebar */}
      {sidebarOpen && (
        <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r bg-sidebar lg:block">
          <Sidebar layout="vertical" />
        </aside>
      )}

      {/* Desktop header with sidebar toggle */}
      <div className="hidden lg:flex fixed inset-x-0 top-0 z-40 h-14 items-center border-b bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <span className="ml-3 text-sm font-semibold">AwardVote</span>
      </div>

      {/* Mobile bottom sidebar always visible */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-sidebar lg:hidden">
        <Sidebar layout="horizontal" />
      </div>

      {/* Main content */}
      <div className={`${sidebarOpen ? "lg:pl-64" : "lg:pl-0"}`}>
        <main className="pt-14 lg:pt-14 pb-24 lg:pb-0 p-4 sm:p-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
