import type { Metadata } from "next";
import { PresidentPage } from "@/app/components/pages/PresidentPage";

export const metadata: Metadata = {
  title: "Message from the President",
  description:
    "Abdullah Serenli, Chairman of the Board: humanity is a shared responsibility that reaches beyond borders and cultural differences.",
};

export default function Page() {
  return <PresidentPage />;
}
