import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/pages/authentication/Register";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "สมัครใช้งาน | FactoryFlow" },
      { name: "description", content: "สร้างบัญชีเจ้าหน้าที่สำหรับระบบจัดการการผลิตในโรงงาน" },
      { property: "og:title", content: "สมัครใช้งาน | FactoryFlow" },
      { property: "og:description", content: "สร้างบัญชีเจ้าหน้าที่สำหรับระบบจัดการการผลิตในโรงงาน" },
    ],
  }),
  component: RegisterPage,
});
