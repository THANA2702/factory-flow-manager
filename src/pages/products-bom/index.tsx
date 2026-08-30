import { useMemo, useState } from "react";
import { Check, History, Network, Plus, X } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Field, SelectField, TextareaField } from "@/components/Field";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/services/store";
import type { BomStatus } from "@/interfaces";
import { cn } from "@/lib/utils";
import { materialOptions } from "@/services/https/api";

type Tab = "products" | "boms" | "approvals";

const bomStatusMeta: Record<
  BomStatus,
  { label: string; tone: "success" | "warning" | "muted" | "danger" }
> = {
  approved: { label: "อนุมัติแล้ว", tone: "success" },
  pending: { label: "รอตรวจสอบ", tone: "warning" },
  draft: { label: "ร่าง", tone: "muted" },
  rejected: { label: "ไม่อนุมัติ", tone: "danger" },
};

const categories = ["บรรจุภัณฑ์", "วัสดุพิมพ์", "วัตถุดิบ"];

export function ProductsBomPage() {
  const { products, boms, addBom, setBomStatus, addProduct } = useStore();
  const [tab, setTab] = useState<Tab>("boms");
  const [bomOpen, setBomOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [bomForm, setBomForm] = useState({
    productCode: "",
    productName: "",
    materials: [] as string[],
    steps: "",
    machines: "",
    category: categories[0]!,
    version: "v1",
  });
  const [productForm, setProductForm] = useState({
    code: "",
    name: "",
    category: categories[0]!,
    bomVersion: "v1",
  });

  const pending = useMemo(() => boms.filter((b) => b.status === "pending"), [boms]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "products", label: `ผลิตภัณฑ์ (${products.length})` },
    { key: "boms", label: `สูตรการผลิต (${boms.length})` },
    { key: "approvals", label: `รออนุมัติ (${pending.length})` },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">ผลิตภัณฑ์ &amp; สูตรการผลิต (BOM)</h1>
            <p className="text-sm text-muted-foreground">
              จัดการข้อมูลผลิตภัณฑ์ สูตรการผลิต และเวอร์ชันย้อนหลัง
            </p>
          </div>
        </div>

        {tab === "products" ? (
          <button
            type="button"
            onClick={() => setProductOpen(true)}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> เพิ่มผลิตภัณฑ์
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setBomOpen(true)}
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> เพิ่มสูตรการผลิต
          </button>
        )}
      </header>

      <nav className="flex gap-6 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "-mb-px border-b-2 pb-3 text-sm transition-colors",
              tab === t.key
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {toast ? (
        <div className="rounded-xl bg-success/20 px-4 py-3 text-sm font-medium text-foreground">
          {toast}
        </div>
      ) : null}

      {tab === "boms" ? (
        <div className="grid gap-5 md:grid-cols-2">
          {boms.map((bom) => (
            <article key={bom.id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold">{bom.productName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {bom.code} • {bom.version}
                  </p>
                </div>
                <StatusBadge tone={bomStatusMeta[bom.status].tone}>
                  {bomStatusMeta[bom.status].label}
                </StatusBadge>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">วัตถุดิบ</p>
              <ul className="mt-1 space-y-1 text-sm">
                {bom.materials.map((m) => (
                  <li key={m.name} className="flex items-center justify-between gap-3">
                    <span>{m.name}</span>
                    <span className="font-semibold">{m.amount}</span>
                  </li>
                ))}
              </ul>

              {bom.steps && bom.steps.length > 0 ? (
                <>
                  <p className="mt-4 text-xs text-muted-foreground">ขั้นตอนการผลิต</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm">
                    {bom.steps.map((step, i) => (
                      <li key={`${bom.id}-step-${i}`}>{step}</li>
                    ))}
                  </ol>
                </>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2">
                {bom.machines.map((m) => (
                  <span
                    key={m}
                    className="rounded-md border border-input bg-card px-2 py-0.5 text-[11px] font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                <History className="h-3 w-3" />
                แก้ไขล่าสุดโดย {bom.updatedBy} • {bom.updatedAt}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      {tab === "products" ? (
        <div className="surface-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">รหัส</th>
                <th className="px-5 py-3 font-medium">ชื่อผลิตภัณฑ์</th>
                <th className="px-5 py-3 font-medium">หมวดหมู่</th>
                <th className="px-5 py-3 font-medium">BOM ที่ใช้งาน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-semibold">{p.code}</td>
                  <td className="px-5 py-3">{p.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">
                      {p.bomVersion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {tab === "approvals" ? (
        <div className="surface-card space-y-3 p-5">
          {pending.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">ไม่มีคำขอรออนุมัติ</p>
          ) : (
            pending.map((bom) => (
              <div
                key={bom.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-warning/15 px-5 py-4"
              >
                <div>
                  <p className="flex items-center gap-2 font-bold">
                    {bom.productName}
                    <span className="rounded-md bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {bom.version}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ส่งโดย {bom.updatedBy} • {bom.updatedAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="ไม่อนุมัติ"
                    onClick={() => {
                      setBomStatus(bom.id, "rejected");
                      notify("ระบบแจ้งเตือนว่าคำขอไม่ได้รับอนุมัติ");
                    }}
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="อนุมัติ"
                    onClick={() => {
                      setBomStatus(bom.id, "approved");
                      notify("อนุมัติสูตรการผลิตแล้ว สถานะเปลี่ยนเป็น “อนุมัติแล้ว”");
                    }}
                    className="rounded-full bg-success p-2 text-success-foreground"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      <Modal
        open={bomOpen}
        onClose={() => setBomOpen(false)}
        title="สูตรการผลิต"
        subtitle="กรอกสูตรการผลิตใหม่"
        footer={
          <>
            <button
              type="button"
              onClick={() => setBomOpen(false)}
              className="text-sm font-semibold text-primary"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                if (!bomForm.productCode || !bomForm.productName) return;
                addBom(bomForm);
                setBomOpen(false);
                setTab("boms");
                notify("ส่งคำขออนุมัติแล้ว สถานะ “รอตรวจสอบ”");
                setBomForm({
                  productCode: "",
                  productName: "",
                  materials: [] as string[],
                  steps: "",
                  machines: "",
                  category: categories[0]!,
                  version: "v1",
                });
              }}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              ขออนุมัติ
            </button>
          </>
        }
      >
        <Field
          placeholder="รหัสผลิตภัณฑ์"
          value={bomForm.productCode}
          onChange={(e) => setBomForm({ ...bomForm, productCode: e.target.value })}
        />
        <Field
          placeholder="ชื่อผลิตภัณฑ์"
          value={bomForm.productName}
          onChange={(e) => setBomForm({ ...bomForm, productName: e.target.value })}
        />
        <Field
          placeholder="วัตถุดิบ"
          value={bomForm.materials}
          onChange={(e) => setBomForm({ ...bomForm, materials: e.target.value })}
        />
        <TextareaField
          label="ขั้นตอนการผลิต"
          placeholder="ขั้นตอนการผลิต (กด Enter เพื่อเพิ่มบรรทัด)"
          value={bomForm.steps}
          onChange={(e) => setBomForm({ ...bomForm, steps: e.target.value })}
        />
        <Field
          placeholder="เครื่องจักร"
          value={bomForm.machines}
          onChange={(e) => setBomForm({ ...bomForm, machines: e.target.value })}
        />
        <SelectField
          label="หมวดหมู่"
          value={bomForm.category}
          onChange={(e) => setBomForm({ ...bomForm, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
        <Field
          label="เวอร์ชัน BOM"
          value={bomForm.version}
          onChange={(e) => setBomForm({ ...bomForm, version: e.target.value })}
        />
      </Modal>

      <Modal
        open={productOpen}
        onClose={() => setProductOpen(false)}
        title="เพิ่มผลิตภัณฑ์"
        subtitle="กรอกข้อมูลผลิตภัณฑ์ใหม่"
        footer={
          <>
            <button
              type="button"
              onClick={() => setProductOpen(false)}
              className="text-sm font-semibold text-primary"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                if (!productForm.code || !productForm.name) return;
                addProduct(productForm);
                setProductOpen(false);
                setTab("products");
                notify("เพิ่มผลิตภัณฑ์ใหม่เรียบร้อยแล้ว");
                setProductForm({ code: "", name: "", category: categories[0]!, bomVersion: "v1" });
              }}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              บันทึก
            </button>
          </>
        }
      >
        <Field
          placeholder="รหัสผลิตภัณฑ์"
          value={productForm.code}
          onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
        />
        <Field
          placeholder="ชื่อผลิตภัณฑ์"
          value={productForm.name}
          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
        />
        <SelectField
          label="หมวดหมู่"
          value={productForm.category}
          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
        <Field
          label="เวอร์ชัน BOM"
          value={productForm.bomVersion}
          onChange={(e) => setProductForm({ ...productForm, bomVersion: e.target.value })}
        />
      </Modal>
    </div>
  );
}
