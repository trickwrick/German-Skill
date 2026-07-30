import type { Metadata } from "next";
import "../../styles/admin.css";

export const metadata: Metadata = {
  title: "Admin | Fluent AUF",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
