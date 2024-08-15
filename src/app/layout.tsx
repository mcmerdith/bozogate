import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { DarkModeManager } from "simple-nextjs-darkmode/client";
import { getServerDarkMode } from "simple-nextjs-darkmode/server";
import { HydrateClient } from "~/trpc/server";
import { cn } from "~/lib/utils";
import { AuthPanel, Navlinks } from "./_components/navbar";
import { getServerAuthSession } from "~/server/auth";
import MobileNav from "./_components/mobile_nav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BOZO Gate",
  description: "Fight to the DEATH",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const darkMode = getServerDarkMode();
  const session = await getServerAuthSession();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-w-screen min-h-screen bg-background text-foreground",
          darkMode && "dark",
        )}
        data-darkmode-target
      >
        <DarkModeManager />
        <TRPCReactProvider>
          <HydrateClient>
            <nav className="flex flex-row items-center justify-start gap-8 bg-accent p-4 text-accent-foreground">
              <Link href="/">
                <h1 className="text-3xl font-bold">BOZO Gate</h1>
              </Link>

              <section className="hidden flex-grow items-center justify-start gap-8 md:flex">
                <Navlinks session={session} />
                <div className="ml-auto flex flex-row items-center gap-4">
                  <AuthPanel session={session} />
                </div>
              </section>
              <section className="ml-auto flex flex-row md:hidden">
                <MobileNav session={session} />
              </section>
            </nav>
            <main className="container flex min-h-screen flex-col items-center pt-4">
              {children}
            </main>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
