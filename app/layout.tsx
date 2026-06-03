import "../styles/globals.css";

export const metadata = {
  title: "GermanSkill",
  description:
    "Learn German, French, Japanese, Spanish and English. Book your free demo class today.",
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
