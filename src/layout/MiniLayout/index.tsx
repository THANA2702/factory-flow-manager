import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function MiniLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold">FactoryFlow</p>
            <p className="text-[11px] text-muted-foreground">Production Suite</p>
          </div>
        </div>
        <div className="surface-card p-8">{children}</div>
      </div>
    </div>
  );
}
