import { Link, useRouterState } from "@tanstack/react-router";
import {
  Boxes,
  LayoutGrid,
  LogOut,
  Sparkles,
  Truck,
  Warehouse as WarehouseIcon,
} from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "แดชบอร์ด", to: "/dashboard", icon: LayoutGrid },
  { title: "ผลิตภัณฑ์ & BOM", to: "/products-bom", icon: Boxes },
  { title: "คลัง & จัดส่ง", to: "/warehouse", icon: Truck },
] as const;

export function Sidebar({ open }: { open: boolean }) {
  const { user, logout } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar py-6 transition-all md:flex",
        open ? "w-64 px-4" : "w-16 items-center px-2",
      )}
    >
      <div className="w-full">
        <div className={cn("flex items-center gap-3", open ? "px-2" : "justify-center")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          {open ? (
            <div className="leading-tight">
              <p className="text-sm font-bold">FactoryFlow</p>
              <p className="text-[11px] text-muted-foreground">Production Suite</p>
            </div>
          ) : null}
        </div>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-muted",
                  !open && "justify-center px-0",
                )}
                title={item.title}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {open ? <span>{item.title}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="w-full">
        <div className={cn("flex items-center gap-3", open ? "px-2" : "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {user?.email.slice(0, 1).toUpperCase() ?? "D"}
          </div>
          {open ? (
            <div className="leading-tight">
              <p className="text-[12px] font-semibold">{user?.email}</p>
              <p className="text-[11px] text-muted-foreground">{user?.name}</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={logout}
          className={cn(
            "mt-4 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10",
            !open && "justify-center px-0",
          )}
        >
          <LogOut className="h-4 w-4" />
          {open ? <span>ออกจากระบบ</span> : null}
        </button>

        {open ? (
          <p className="mt-4 flex items-center gap-2 px-2 text-[10px] text-muted-foreground">
            <WarehouseIcon className="h-3 w-3" />
            ระบบย่อย 2 ระบบ (T06)
          </p>
        ) : null}
      </div>
    </aside>
  );
}
