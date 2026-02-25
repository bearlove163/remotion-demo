import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TTS Reader - 智能配音阅读器",
  description: "像课文一样学习英语 - 智能配音 + 单词表",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
