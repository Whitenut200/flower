import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Flower Pick - 꽃 추천 & 꽃말 도감",
  description: "목적별 꽃 추천, 365일 탄생화, 꽃말 도감, 주변 꽃집 찾기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen pb-20">
        <div className="max-w-lg mx-auto">{children}</div>
        <Nav />
      </body>
    </html>
  );
}
