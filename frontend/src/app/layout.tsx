import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { UserProvider } from "@/context/UserContext";
import TanstackProvider from '@/providers/TanstackProvider'
import { Toaster } from "@/components/ui/toast"

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connecting to tutor",
  description: "The platform to connect student to tutor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="vi"
      className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
    >
      <body className={cn("antialiased", inter.variable, geist.variable)}>
        <TanstackProvider>
          <UserProvider>
            <main className="flex-1">{children}</main>
            <Toaster/>
          </UserProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
