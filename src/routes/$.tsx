import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/pages/not-found";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "ไม่พบหน้า | FactoryFlow" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotFoundPage,
});
