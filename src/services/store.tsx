import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type {
  Bom,
  BomStatus,
  Product,
  Shipment,
  StockItem,
  StockTransaction,
  TransactionType,
} from "@/interfaces";
import { seedBoms, seedProducts, seedShipments, seedStock } from "@/services/https/api";

interface StoreValue {
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

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stock, setStock] = useState<StockItem[]>(seedStock);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>(seedShipments);
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [boms, setBoms] = useState<Bom[]>(seedBoms);

  const submitTransaction = useCallback<StoreValue["submitTransaction"]>(
    (input) => {
      const qty = Math.abs(input.quantity);
      if (!input.code || !input.name || !qty) {
        return { ok: false, message: "กรุณากรอกรหัสสินค้า ชื่อสินค้า และจำนวนให้ครบถ้วน" };
      }
      const existing = stock.find((s) => s.code.toLowerCase() === input.code.toLowerCase());

      if (input.type === "issue") {
        if (!existing || existing.quantity < qty) {
          return { ok: false, message: "สินค้าไม่เพียงพอในคลัง ไม่สามารถเบิกจ่ายได้" };
        }
        setStock((prev) =>
          prev.map((s) => (s.id === existing.id ? { ...s, quantity: s.quantity - qty } : s)),
        );
      } else if (existing) {
        setStock((prev) =>
          prev.map((s) =>
            s.id === existing.id
              ? {
                  ...s,
                  quantity: s.quantity + qty,
                  location: input.location || s.location,
                  palette: input.palette || s.palette,
                  lot: input.lot || s.lot,
                }
              : s,
          ),
        );
      } else {
        setStock((prev) => [
          ...prev,
          {
            id: `s${Date.now()}`,
            code: input.code.toUpperCase(),
            name: input.name,
            quantity: qty,
            unit: "ชิ้น",
            location: input.location || "A-00",
            palette: input.palette,
            lot: input.lot,
          },
        ]);
      }

      setTransactions((prev) => [
        {
          id: `t${Date.now()}`,
          type: input.type,
          code: input.code.toUpperCase(),
          name: input.name,
          quantity: qty,
          location: input.location,
          palette: input.palette,
          lot: input.lot,
          createdAt: new Date().toLocaleString("th-TH"),
        },
        ...prev,
      ]);

      if (input.type === "issue") {
        setShipments((prev) => [
          {
            id: `h${Date.now()}`,
            code: `SHP-${500 + prev.length + 1}`,
            customer: "รอกำหนดปลายทาง",
            productName: input.name,
            quantity: qty,
            eta: "รอกำหนด",
            status: "pending",
          },
          ...prev,
        ]);
      }

      return {
        ok: true,
        message: input.type === "receive" ? "บันทึกการรับสินค้าเข้าคลังแล้ว" : "บันทึกการเบิกจ่ายสินค้าแล้ว",
      };
    },
    [stock],
  );

  const verifyShipment = useCallback((id: string) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "shipped", verifiedAt: new Date().toLocaleDateString("th-TH") }
          : s,
      ),
    );
  }, []);

  const addShipment = useCallback<StoreValue["addShipment"]>((input) => {
    setShipments((prev) => [
      {
        id: `h${Date.now()}`,
        code: `SHP-${500 + prev.length + 1}`,
        customer: input.customer,
        productName: input.productName,
        quantity: input.quantity,
        eta: input.eta ? new Date(input.eta).toLocaleDateString("th-TH") : "รอกำหนด",
        status: "pending",
      },
      ...prev,
    ]);
  }, []);

  const addBom = useCallback<StoreValue["addBom"]>((input) => {
    setBoms((prev) => [
      {
        id: `b${Date.now()}`,
        code: `BOM-${String(prev.length + 1).padStart(3, "0")}`,
        productCode: input.productCode.toUpperCase(),
        productName: input.productName,
        version: input.version || "v1",
        category: input.category,
        materials: input.materials.map((m) => ({ name: m, amount: "-" })),
        steps: input.steps
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        machines: input.machines
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        status: "pending",
        updatedBy: "สมชาย (Planner)",
        updatedAt: new Date().toLocaleDateString("th-TH"),
      },
      ...prev,
    ]);
  }, []);

  const setBomStatus = useCallback((id: string, status: BomStatus) => {
    setBoms((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status, updatedBy: "จันทร์เพ็ญ (QC)", updatedAt: new Date().toLocaleDateString("th-TH") }
          : b,
      ),
    );
  }, []);

  const addProduct = useCallback<StoreValue["addProduct"]>((input) => {
    setProducts((prev) => [
      ...prev,
      {
        id: `p${Date.now()}`,
        code: input.code.toUpperCase(),
        name: input.name,
        category: input.category,
        bomVersion: input.bomVersion || "v1",
      },
    ]);
  }, []);

  const value = useMemo(
    () => ({
      stock,
      transactions,
      shipments,
      products,
      boms,
      submitTransaction,
      verifyShipment,
      addBom,
      setBomStatus,
      addProduct,
    }),
    [stock, transactions, shipments, products, boms, submitTransaction, verifyShipment, addBom, setBomStatus, addProduct],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
