import { createFileRoute } from "@tanstack/react-router";
import { FullLayout } from "@/layout/FullLayout";
import { DashboardPage } from "@/pages/dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "แดชบอร์ด | FactoryFlow ระบบจัดการการผลิตในโรงงาน" },
      {
        name: "description",
        content: "ภาพรวมคลังสินค้าสำเร็จรูป การจัดส่ง และสูตรการผลิตในระบบ FactoryFlow",
      },
      { property: "og:title", content: "แดชบอร์ด | FactoryFlow" },
      { property: "og:description", content: "ภาพรวม 2 ระบบย่อยของระบบจัดการการผลิตในโรงงาน" },
    ],
  }),
  component: () => (
    <FullLayout>
      <DashboardPage />
    </FullLayout>
  ),
});
