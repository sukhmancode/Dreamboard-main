"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ProfileLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/");
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      Log Out
    </Button>
  );
}
