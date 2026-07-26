import type { Metadata } from "next";
import { BoardPage } from "@/app/components/pages/BoardPage";

export const metadata: Metadata = {
  title: "Yönetim Kurulu",
  description:
    "Uluslararası İnsanlık Köprüsü Derneği'nin (IHBA) kuruluşunda seçilen ve karar organı olarak görev yapan yönetim kurulu.",
};

export default function Page() {
  return <BoardPage />;
}
