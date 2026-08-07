import { createFileRoute } from "@tanstack/react-router";
import { FullLayout } from "@/layout/FullLayout";
import { ProductsBomPage } from "@/pages/products-bom";

export const Route = createFileRoute("/products-bom")({
  head: () => ({
    meta: [
      { title: "ผลิตภัณฑ์ & สูตรการผลิต (BOM) | FactoryFlow" },
      {
        name: "description",
        content: "จัดการข้อมูลผลิตภัณฑ์ สูตรการผลิต เวอร์ชัน BOM และการขออนุมัติจากฝ่ายควบคุมคุณภาพ",
      },
      { property: "og:title", content: "ผลิตภัณฑ์ & สูตรการผลิต (BOM) | FactoryFlow" },
      {
        property: "og:description",
        content: "ระบบจัดการข้อมูลผลิตภัณฑ์และสูตรการผลิตของโรงงาน",
      },
    ],
  }),
  component: () => (
    <FullLayout>
      <ProductsBomPage />
    </FullLayout>
  ),
});
