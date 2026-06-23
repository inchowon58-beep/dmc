import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "영양제" },
  description: "쿠팡 파트너스 상품 리뷰",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
