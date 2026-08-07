import { createFileRoute } from "@tanstack/react-router";
import { FullLayout } from "@/layout/FullLayout";
import { WarehousePage } from "@/pages/warehouse";

export const Route = createFileRoute("/warehouse")({
  head: () => ({
    meta: [
      { title: "คลังสินค้า & จัดส่ง | FactoryFlow" },
      {
        name: "description",
        content: "รับสินค้าเข้าคลัง เบิกจ่ายสินค้า ตรวจสอบก่อนจัดส่ง และดูประวัติการจัดส่งสินค้าสำเร็จรูป",
      },
      { property: "og:title", content: "คลังสินค้า & จัดส่ง | FactoryFlow" },
      {
        property: "og:description",
        content: "ระบบคลังสินค้าสำเร็จรูปและจัดส่งสินค้าของโรงงาน",
      },
    ],
  }),
  component: () => (
    <FullLayout>
      <WarehousePage />
    </FullLayout>
  ),
});
