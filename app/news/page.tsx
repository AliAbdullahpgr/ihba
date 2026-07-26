import type { Metadata } from "next";
import { NewsPage } from "@/app/components/pages/NewsPage";

export const metadata: Metadata = {
  title: "News",
  description:
    "Field reports, project updates and announcements from the regions where IHBA works.",
};

export default function Page() {
  return <NewsPage />;
}
