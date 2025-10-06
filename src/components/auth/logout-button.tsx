"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/server/auth";

export default function LogoutButton() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <Button onClick={handleLogout} variant="outline" className="w-full">
      Sair
    </Button>
  );
}
