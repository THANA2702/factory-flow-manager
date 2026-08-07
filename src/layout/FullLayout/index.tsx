import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { RequireAuth } from "@/auth/RequireAuth";

export function FullLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <RequireAuth>
      <div className="flex min-h-screen w-full">
        <Sidebar open={open} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onToggleSidebar={() => setOpen((v) => !v)} />
          <main className="flex-1 px-4 py-8 md:px-10">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
