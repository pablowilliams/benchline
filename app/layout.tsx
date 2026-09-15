import type { Metadata } from "next";
import "../src/styles.css";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  metadataBase: new URL("https://benchline-ranking-workbench.gjpw.chatgpt.site"),
  title: "Benchline | Ranking workbench",
  description: "A production-shaped ranking evaluation, recommendation, and model release workbench.",
  openGraph: {
    title: "Benchline",
    description: "Ranking evidence, release control, and recommendation operations",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Benchline",
    description: "Ranking evidence, release control, and recommendation operations",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
