import type { Metadata } from "next";
import { Fredoka, Patrick_Hand, Gochi_Hand } from "next/font/google";
import "./globals.css";

// Chunky rounded display font for headings + stickers
const fredoka = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Marker / handwriting for body copy
const patrick = Patrick_Hand({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
});

// Scribbly accent font for playful bits
const gochi = Gochi_Hand({
  variable: "--font-scribble",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Who Drew That? — the drawing bluff game",
  description:
    "A multiplayer social-deduction drawing game. Everyone sketches the secret word… except the imposters. Can you spot who's faking it?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${patrick.variable} ${gochi.variable} h-full antialiased`}
    >
      <body className="paper-bg min-h-full flex flex-col text-ink">
        {children}
      </body>
    </html>
  );
}
