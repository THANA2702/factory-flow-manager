import { useMemo, useState } from "react";
import { Boxes, Truck, Warehouse } from "lucide-react";
import { Modal } from "@/components/Modal";
import { Field, SelectField } from "@/components/Field";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore } from "@/services/store";
import type { ShipmentStatus, TransactionType } from "@/interfaces";

const statusMeta: Record<ShipmentStatus, { label: string; tone: "success" | "info" | "warning" }> = {
  shipped: { label: "จัดส่ง", tone: "success" },
  ready: { label: "เตรียมส่ง", tone: "info" },
  pending: { label: "รอตรวจ", tone: "warning" },
};

const emptyForm = {
  type: "receive" as TransactionType,
  code: "",
  name: "",
  quantity: "",
  location: "",
  palette: "",
  lot: "",
};

export function WarehousePage() {
  const { stock, shipments, submitTransaction, verifyShipment, transactions } = useStore();
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [verifyId, setVerifyId] = useState<string | null>(null);

  const verifying = useMemo(() => shipments.find((s) => s.id === verifyId), [shipments, verifyId]);

  const openForm = (type: TransactionType) => {
    setForm({ ...emptyForm, type });
    setError("");
    setFormOpen(true);
  };

  const save = () => {
    const result = submitTransaction({
      type: form.type,
      code: form.code,
      name: form.name,
      quantity: Number(form.quantity.replace(/[^\d.]/g, "")),
      location: form.location,
      palette: form.palette,
      lot: form.lot,
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setFormOpen(false);
    setToast(result.message);
    window.setTimeout(() => setToast(""), 3000);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Warehouse className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">คลังสินค้า</h1>
            <p className="text-sm text-muted-foreground">สต๊อกสินค้าสำเร็จรูปและการจัดส่ง</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openForm("receive")}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            ทำรายการ
          </button>
          <button
            type="button"
            onClick={() => openForm("issue")}
            className="rounded-full border border-input bg-card px-5 py-2 text-sm font-semibold transition-colors hover:bg-muted"
          >
            เบิกจ่ายสินค้า
          </button>
        </div>
      </header>

      {toast ? (
        <div className="rounded-xl bg-success/20 px-4 py-3 text-sm font-medium text-foreground">
          {toast}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="surface-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Boxes className="h-4 w-4 text-primary" />
            สต๊อกสินค้าสำเร็จรูป
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {stock.map((item) => (
              <article key={item.id} className="rounded-2xl bg-secondary p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">{item.code}</span>
                  <span className="rounded-md border border-input bg-card px-2 py-0.5 text-[11px] font-medium">
                    {item.location}
                  </span>
                </div>
                <p className="mt-2 font-bold">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity.toLocaleString("th-TH")} {item.unit}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Truck className="h-4 w-4 text-primary" />
            รายการจัดส่ง
          </h2>

          <div className="mt-4 space-y-3">
            {shipments.map((sh) => (
              <button
                key={sh.id}
                type="button"
                onClick={() => setVerifyId(sh.id)}
                className="w-full rounded-2xl bg-secondary p-4 text-left transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{sh.customer}</p>
                  <StatusBadge tone={statusMeta[sh.status].tone}>
                    {statusMeta[sh.status].label}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sh.code} • {sh.productName} × {sh.quantity.toLocaleString("th-TH")}
                </p>
                <p className="mt-1 text-xs font-medium text-primary">ETA: {sh.eta}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {transactions.length > 0 ? (
        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">ประวัติการทำรายการ</h2>
          <div className="mt-3 divide-y divide-border text-sm">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="font-medium">
                  {tx.type === "receive" ? "รับเข้า" : "เบิกจ่าย"} • {tx.code} {tx.name}
                </span>
                <span className="text-muted-foreground">
                  {tx.quantity.toLocaleString("th-TH")} • Lot {tx.lot || "-"} • {tx.createdAt}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={form.type === "receive" ? "รับสินค้าเข้าคลัง" : "เบิกจ่ายสินค้าเพื่อจัดส่ง"}
        subtitle="บันทึกการรับเข้า เบิกจ่าย โอนย้าย"
        footer={
          <>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="text-sm font-semibold text-primary"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              บันทึก
            </button>
          </>
        }
      >
        <SelectField
          label="ประเภทรายการ"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
        >
          <option value="receive">รับสินค้า</option>
          <option value="issue">เบิกจ่ายสินค้า</option>
        </SelectField>
        <Field
          placeholder="รหัสสินค้า"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <Field
          placeholder="ชื่อสินค้า"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Field
          placeholder="จำนวน (เช่น +500 kg)"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <Field
          placeholder="ตำแหน่งที่จัดเก็บ"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <Field
          placeholder="Palette number"
          value={form.palette}
          onChange={(e) => setForm({ ...form, palette: e.target.value })}
        />
        <Field
          placeholder="Lot number"
          value={form.lot}
          onChange={(e) => setForm({ ...form, lot: e.target.value })}
        />
        {error ? <p className="pl-1 text-sm font-medium text-destructive">{error}</p> : null}
      </Modal>

      <Modal
        open={Boolean(verifying)}
        onClose={() => setVerifyId(null)}
        title={"ตรวจสอบความถูกต้อง\nก่อนจัดส่ง"}
        footer={
          <>
            <button
              type="button"
              onClick={() => setVerifyId(null)}
              className="text-sm font-semibold text-primary"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                if (verifying) verifyShipment(verifying.id);
                setVerifyId(null);
                setToast("บันทึกการจัดส่งแล้ว สถานะเปลี่ยนเป็น “จัดส่ง”");
                window.setTimeout(() => setToast(""), 3000);
              }}
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground"
            >
              ยืนยัน
            </button>
          </>
        }
      >
        {verifying ? (
          <div className="rounded-2xl bg-secondary p-5">
            <p className="text-lg font-bold">{verifying.customer}</p>
            <p className="mt-2 text-sm">
              {verifying.code} • {verifying.productName} × {verifying.quantity.toLocaleString("th-TH")}
            </p>
            <p className="mt-3 text-sm font-medium text-primary">ETA: {verifying.eta}</p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
