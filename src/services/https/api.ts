import type { Bom, Product, Shipment, StockItem, StockTransaction } from "@/interfaces";

/**
 * Mock HTTP service layer. ในระบบจริงให้เปลี่ยน body ของแต่ละฟังก์ชันเป็น fetch(BASE_URL + path)
 */
export const BASE_URL = "/api";

/** วัตถุดิบต้นแบบ — ในระบบจริงดึงจากฐานข้อมูลวัตถุดิบ */
export const materialOptions: string[] = [
  "เม็ดพลาสติก PET",
  "เม็ดพลาสติก HDPE",
  "ฝาเกลียว",
  "ฉลากสินค้า",
  "สีพิมพ์",
  "กาวลามิเนต",
  "ฟิล์มหด",
  "กล่องกระดาษลูกฟูก",
];

export const seedStock: StockItem[] = [
  { id: "s1", code: "FG-001", name: "ขวด PET 500ml", quantity: 18392, unit: "ขวด", location: "A-01" },
  { id: "s2", code: "FG-002", name: "ขวด PET 1L", quantity: 9240, unit: "ขวด", location: "A-02" },
  { id: "s3", code: "FG-003", name: "ฝาเกลียว", quantity: 45000, unit: "ชิ้น", location: "B-01" },
  { id: "s4", code: "FG-004", name: "ขวด HDPE", quantity: 3120, unit: "ขวด", location: "A-03" },
];

export const seedShipments: Shipment[] = [
  {
    id: "h1",
    code: "SHP-501",
    customer: "บ.น้ำดื่ม A",
    productName: "ขวด PET 500ml",
    quantity: 5000,
    eta: "วันนี้",
    status: "shipped",
  },
  {
    id: "h2",
    code: "SHP-502",
    customer: "บ.เครื่องดื่ม B",
    productName: "ขวด PET 1L",
    quantity: 2000,
    eta: "พรุ่งนี้",
    status: "ready",
  },
  {
    id: "h3",
    code: "SHP-503",
    customer: "บ.บรรจุภัณฑ์ C",
    productName: "ฝาเกลียว",
    quantity: 20000,
    eta: "12 ก.ค.",
    status: "pending",
  },
];

export const seedProducts: Product[] = [
  { id: "p1", code: "P-001", name: "ขวด PET 500ml", category: "บรรจุภัณฑ์", bomVersion: "v3" },
  { id: "p2", code: "P-002", name: "ฝาเกลียว 28mm", category: "บรรจุภัณฑ์", bomVersion: "v2" },
  { id: "p3", code: "P-003", name: "ขวด HDPE 1L", category: "บรรจุภัณฑ์", bomVersion: "v1" },
  { id: "p4", code: "P-004", name: "ฉลากฟิล์มหด", category: "วัสดุพิมพ์", bomVersion: "v1" },
  { id: "p5", code: "P-005", name: "ลังกระดาษ 12 ช่อง", category: "บรรจุภัณฑ์", bomVersion: "v1" },
];

export const seedBoms: Bom[] = [
  {
    id: "b1",
    code: "BOM-001",
    productCode: "P-001",
    productName: "ขวด PET 500ml",
    version: "v3",
    category: "บรรจุภัณฑ์",
    materials: [
      { name: "PET Resin (RM-001)", amount: "12 g" },
      { name: "สีมาสเตอร์แบทช์ (RM-005)", amount: "0.3 g" },
    ],
    machines: ["M-01", "M-02"],
    status: "approved",
    updatedBy: "จันทร์เพ็ญ (QC)",
    updatedAt: "10 ก.ค. 2026",
  },
  {
    id: "b2",
    code: "BOM-002",
    productCode: "P-006",
    productName: "ขวด PET 1L",
    version: "v3",
    category: "บรรจุภัณฑ์",
    materials: [
      { name: "PET Resin (RM-001)", amount: "22 g" },
      { name: "สีมาสเตอร์แบทช์ (RM-005)", amount: "0.5 g" },
    ],
    machines: ["M-03"],
    status: "pending",
    updatedBy: "สมชาย (Planner)",
    updatedAt: "12 ก.ค. 2026",
  },
  {
    id: "b3",
    code: "BOM-003",
    productCode: "P-002",
    productName: "ฝาเกลียว 28mm",
    version: "v2",
    category: "บรรจุภัณฑ์",
    materials: [{ name: "PP Compound (RM-004)", amount: "3 g" }],
    machines: ["M-05"],
    status: "draft",
    updatedBy: "อรพิน (Planner)",
    updatedAt: "13 ก.ค. 2026",
  },
];

export async function getStock(): Promise<StockItem[]> {
  return Promise.resolve(seedStock);
}

export async function getShipments(): Promise<Shipment[]> {
  return Promise.resolve(seedShipments);
}

export async function getProducts(): Promise<Product[]> {
  return Promise.resolve(seedProducts);
}

export async function getBoms(): Promise<Bom[]> {
  return Promise.resolve(seedBoms);
}

export async function postStockTransaction(tx: StockTransaction): Promise<StockTransaction> {
  return Promise.resolve(tx);
}
