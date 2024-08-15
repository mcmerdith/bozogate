"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export function AuthPanel({ session }: { session: Session | null }) {
  if (session?.user) {
    return (
      <>
        <p>Welcome {session.user.name}</p>
        <div className="flex flex-row items-center justify-center gap-4">
          <Link href="/account">
            <UserRound />
          </Link>
          <Button icon={<LogOut />} onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      </>
    );
  } else {
    return (
      <Button icon={<LogIn />} onClick={() => signIn()}>
        Sign in
      </Button>
    );
  }
}

export function Navlinks({ session }: { session: Session | null }) {
  return (
    <>
      <Link href="/play">
        <p>Play</p>
      </Link>
    </>
  );
}
