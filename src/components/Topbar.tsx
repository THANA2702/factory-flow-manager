import { Bell, Menu } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import type { Role } from "@/interfaces";

const roleLabels: Record<Role, string> = {
  Planner: "เจ้าหน้าที่ฝ่ายวางแผนการผลิต",
  Warehouse: "เจ้าหน้าที่ฝ่ายคลังสินค้า",
  Shipping: "เจ้าหน้าที่ฝ่ายจัดส่งสินค้า",
  QC: "เจ้าหน้าที่ฝ่ายควบคุมคุณภาพ",
};

export function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, setRole } = useAuth();
  const role = user?.role ?? "Planner";

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-card/70 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="สลับเมนู"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">FactoryFlow</span>
        <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">
          {role}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="leading-tight">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              aria-label="เลือกบทบาทผู้ใช้"
              className="bg-transparent text-[12px] font-semibold outline-none"
            >
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <span className="hidden pl-1 text-[10px] text-muted-foreground sm:block">
              {roleLabels[role]}
            </span>
          </span>
        </label>

        <button type="button" aria-label="การแจ้งเตือน" className="relative rounded-lg p-1.5 hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
