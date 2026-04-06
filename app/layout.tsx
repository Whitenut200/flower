import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "꽃 선물 고민? 꽃픽에서 추천받자",
  description: "상황별 꽃/화초 추천부터 365일 탄생화, 주변 꽃집 찾기까지",
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
