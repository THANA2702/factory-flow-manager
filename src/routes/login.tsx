import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/authentication/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "เข้าสู่ระบบ | FactoryFlow" },
      { name: "description", content: "เข้าสู่ระบบจัดการการผลิตในโรงงาน FactoryFlow" },
      { property: "og:title", content: "เข้าสู่ระบบ | FactoryFlow" },
      { property: "og:description", content: "เข้าสู่ระบบจัดการการผลิตในโรงงาน" },
    ],
  }),
  component: LoginPage,
});
