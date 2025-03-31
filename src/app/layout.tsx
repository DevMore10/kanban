import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { Header } from "@/_components/header";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider
    //   appearance={{
    //     baseTheme: neobrutalism,
    //   }}>
    <html lang="en">
      <body className={`${dmSans.variable} antialiased font-sans`}>
        <ConvexClientProvider>
          <Header />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
    // </ClerkProvider>
  );
}
