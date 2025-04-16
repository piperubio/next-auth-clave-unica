import { ClaveUnicaForm } from "@/components/clave-unica-form";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();
  if (session)
    return redirect(env.WITH_REDIRECT ? "/private-redirect" : "/private");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <ClaveUnicaForm />
      <footer className="mt-8">
        <a
          href="https://github.com/piperubio/next-auth-clave-unica"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Ver el repositorio en GitHub
        </a>
      </footer>
    </div>
  );
}
