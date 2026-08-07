import { Link } from "@tanstack/react-router";
import { Boxes, LayoutGrid, Truck } from "lucide-react";
import { useStore } from "@/services/store";

export function DashboardPage() {
  const { stock, shipments, boms, products } = useStore();

  const totalStock = stock.reduce((sum, s) => sum + s.quantity, 0);
  const pendingShipments = shipments.filter((s) => s.status !== "shipped").length;
  const pendingBoms = boms.filter((b) => b.status === "pending").length;

  const cards = [
    { label: "สินค้าสำเร็จรูปในคลัง", value: totalStock.toLocaleString("th-TH") },
    { label: "รายการจัดส่งที่ค้างอยู่", value: pendingShipments },
    { label: "ผลิตภัณฑ์ทั้งหมด", value: products.length },
    { label: "สูตรการผลิตรออนุมัติ", value: pendingBoms },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">แดชบอร์ด</h1>
          <p className="text-sm text-muted-foreground">
            ภาพรวม 2 ระบบย่อยของระบบจัดการการผลิตในโรงงาน
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-5">
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Link to="/warehouse" className="surface-card p-6 transition-shadow hover:shadow-lg">
          <Truck className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-bold">ระบบคลังสินค้าสำเร็จรูปและจัดส่งสินค้า</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            รับสินค้าเข้าคลัง เบิกจ่ายสินค้า ตรวจสอบก่อนจัดส่ง และดูประวัติการจัดส่ง
          </p>
        </Link>

        <Link to="/products-bom" className="surface-card p-6 transition-shadow hover:shadow-lg">
          <Boxes className="h-6 w-6 text-primary" />
          <h2 className="mt-3 font-bold">ระบบจัดการข้อมูลผลิตภัณฑ์ / สูตรการผลิต</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            เพิ่มสูตรการผลิต ขออนุมัติจากฝ่ายควบคุมคุณภาพ และเพิ่มผลิตภัณฑ์ใหม่
          </p>
        </Link>
      </div>
    </div>
  );
}
