export type Role = "Planner" | "Warehouse" | "Shipping" | "QC";

export interface AppUser {
  email: string;
  name: string;
  role: Role;
}

/* ---------- ระบบคลังสินค้าสำเร็จรูปและจัดส่งสินค้า ---------- */

export interface StockItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  palette?: string | undefined;
  lot?: string | undefined;
}

export type TransactionType = "receive" | "issue";

export interface StockTransaction {
  id: string;
  type: TransactionType;
  code: string;
  name: string;
  quantity: number;
  location: string;
  palette: string;
  lot: string;
  createdAt: string;
}

export type ShipmentStatus = "pending" | "ready" | "shipped";

export interface Shipment {
  id: string;
  code: string;
  customer: string;
  productName: string;
  quantity: number;
  eta: string;
  status: ShipmentStatus;
  verifiedAt?: string | undefined;
}

/* ---------- ระบบจัดการข้อมูลผลิตภัณฑ์ / สูตรการผลิต ---------- */

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  bomVersion: string;
}

export type BomStatus = "draft" | "pending" | "approved" | "rejected";

export interface BomMaterial {
  name: string;
  amount: string;
}

export interface Bom {
  id: string;
  code: string;
  productCode: string;
  productName: string;
  version: string;
  category: string;
  materials: BomMaterial[];
  machines: string[];
  steps?: string[] | undefined;
  status: BomStatus;
  updatedBy: string;
  updatedAt: string;
}
