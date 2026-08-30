import { createContext } from "react";
import type {
  Bom,
  BomStatus,
  Product,
  Shipment,
  StockItem,
  StockTransaction,
  TransactionType,
} from "@/interfaces";

export interface StoreValue {
  stock: StockItem[];
  transactions: StockTransaction[];
  shipments: Shipment[];
  products: Product[];
  boms: Bom[];
  submitTransaction: (input: {
    type: TransactionType;
    code: string;
    name: string;
    quantity: number;
    location: string;
    palette: string;
    lot: string;
  }) => { ok: boolean; message: string };
  verifyShipment: (id: string) => void;
  addShipment: (input: { customer: string; productName: string; quantity: number; eta: string }) => void;
  updateShipment: (
    id: string,
    input: { customer: string; productName: string; quantity: number; eta: string },
  ) => void;
  deleteShipment: (id: string) => void;
  addBom: (input: {
    productCode: string;
    productName: string;
    materials: string[];
    steps: string;
    machines: string;
    category: string;
    version: string;
  }) => void;
  setBomStatus: (id: string, status: BomStatus) => void;
  addProduct: (input: { code: string; name: string; category: string; bomVersion: string }) => void;
}

export const StoreContext = createContext<StoreValue | null>(null);
