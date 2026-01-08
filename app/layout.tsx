import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LangGraph Chat App",
  description: "Chat application powered by LangGraph",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-white h-screen w-screen text-gray-900 antialiased selection:bg-blue-500/30 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
