"use client";

import { env } from "@/env";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Limpiar la sesión de NextAuth
    await signOut({ redirect: false });
    // Redirigir a la página de logout de Clave Única
    window.location.href = env.NEXT_PUBLIC_CLAVE_UNICA_LOGOUT_URL;

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };
  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
    >
      Cerrar sesión
    </button>
  );
}
