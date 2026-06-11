import "../styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://fluentauf.com"),
  title: "Fluent AUF",
  description:
    "Learn German online with Fluent AUF. A1–B2 Goethe certified live classes. Book your free demo class today.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
