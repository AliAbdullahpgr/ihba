import type { Metadata } from "next";
import { ContactPage } from "@/app/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Bağış, gönüllülük, iş birliği veya basın talepleriniz için IHBA ile iletişime geçin. Merkez ofis: Sultanbeyli, İstanbul, Türkiye.",
};

export default function Page() {
  return <ContactPage />;
}
