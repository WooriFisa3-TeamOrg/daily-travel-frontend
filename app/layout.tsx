import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/biz/providers/react-query-provider";
import { NextAuthProvider } from "@/biz/providers/next-auth-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/biz/utils/authOptions";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/biz/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Daily Travel",
    description: "자유 여행 계획 공유 서비스",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    return (
        <html suppressHydrationWarning={true} lang="ko">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased",
                    fontSans.variable
                )}
            >
                <NextAuthProvider session={session}>
                    <ReactQueryProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="dark"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                            <Toaster />
                        </ThemeProvider>
                    </ReactQueryProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
