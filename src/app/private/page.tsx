import { LogoutButton } from "@/components/logout-button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PrivatePage() {
  const session = await auth();
  if (!session) return redirect("/");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-2xl font-bold">Bienvenido, estás autenticado</h1>
      <LogoutButton />
    </div>
  );
}
