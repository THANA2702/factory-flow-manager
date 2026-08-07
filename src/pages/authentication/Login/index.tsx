import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MiniLayout } from "@/layout/MiniLayout";
import { Field, SelectField } from "@/components/Field";
import { useAuth } from "@/auth/AuthProvider";
import type { Role } from "@/interfaces";

const roles: Role[] = ["Planner", "Warehouse", "Shipping", "QC"];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@factoryflow.app");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState<Role>("Planner");

  return (
    <MiniLayout>
      <h1 className="text-xl font-bold">เข้าสู่ระบบ</h1>
      <p className="mt-2 text-sm text-muted-foreground">ระบบจัดการการผลิตในโรงงาน (FactoryFlow)</p>

      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          login(email, role);
          navigate({ to: "/dashboard" });
        }}
      >
        <Field
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <SelectField label="บทบาท" value={role} onChange={(e) => setRole(e.target.value as Role)}>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </SelectField>

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          เข้าสู่ระบบ
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        ยังไม่มีบัญชี?{" "}
        <Link to="/register" className="font-semibold text-primary">
          สมัครใช้งาน
        </Link>
      </p>
    </MiniLayout>
  );
}
