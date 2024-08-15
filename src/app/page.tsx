import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <h1>
      Welcome to BOZO Gate! Click <Link href="/play">here</Link> to get started.
    </h1>
  );
}
