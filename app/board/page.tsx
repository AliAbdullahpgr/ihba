import type { Metadata } from "next";
import { BoardPage } from "@/app/components/pages/BoardPage";

export const metadata: Metadata = {
  title: "Board of Directors",
  description:
    "The board elected at the founding of Uluslararası İnsanlık Köprüsü Derneği (IHBA), serving as its governing body.",
};

export default function Page() {
  return <BoardPage />;
}
