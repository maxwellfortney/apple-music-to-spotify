"use client";

import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { useMemo } from "react";
import { authClient } from "@/services/auth/auth.client";

export default function Page() {
  const { data: session, isPending, error } = authClient.useSession();

  const content = useMemo(() => {
    if (isPending) {
      return <div>Loading...</div>;
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    if (session) {
      return (
        <>
          <h1>Session</h1>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <Button onClick={() => authClient.signOut()}>Logout</Button>
        </>
      );
    }

    return (
      <div>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </div>
    );
  }, [isPending, error, session]);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        {content}
      </div>
    </div>
  );
}
