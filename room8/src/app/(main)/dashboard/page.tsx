"use client";

import useSignOut from "@/app/auth/hooks/useSignOut";
import useUser from "@/app/auth/hooks/useUser";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const signout = useSignOut();

  return (
    <div className="grid place-content-center min-h-screen gap-2 text-center">
      <p>Dashboard Page</p>
      {user && <p>{user.name}</p>}
      <Button
        onClick={() => {
          signout();
        }}
      >
        Sign Out
      </Button>
    </div>
  );
}
