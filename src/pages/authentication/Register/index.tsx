import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MiniLayout } from "@/layout/MiniLayout";
import { Field, SelectField } from "@/components/Field";
import { useAuth } from "@/auth/AuthProvider";
import type { Role } from "@/interfaces";

const roles: Role[] = ["Planner", "Warehouse", "Shipping", "QC"];

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Planner");

  return (
    <MiniLayout>
      <h1 className="text-xl font-bold">สมัครใช้งาน</h1>
      <p className="mt-2 text-sm text-muted-foreground">สร้างบัญชีผู้ใช้งานสำหรับเจ้าหน้าที่โรงงาน</p>

      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || !password) return;
          register(email, role);
          navigate({ to: "/dashboard" });
        }}
      >
        <Field placeholder="อีเมล" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          placeholder="รหัสผ่าน"
          type="password"
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
          สมัครใช้งาน
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        มีบัญชีแล้ว?{" "}
        <Link to="/login" className="font-semibold text-primary">
          เข้าสู่ระบบ
        </Link>
      </p>
    </MiniLayout>
  );
}
