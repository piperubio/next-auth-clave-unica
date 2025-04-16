"use server";

import { env } from "@/env";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function signInClaveUnica() {
  try {
    await signIn("clave-unica", {
      redirectTo: env.WITH_REDIRECT ? "/private-redirect" : "/private",
    });
  } catch (error) {
    // Signin can fail for a number of reasons, such as the user
    // not existing, or the user not having the correct role.
    // In some cases, you may want to redirect to a custom error
    if (error instanceof AuthError) {
      return redirect(`/error?error=${error.message}`);
    }

    // Otherwise if a redirects happens Next.js can handle it
    // so you can just re-thrown the error and let Next.js handle it.
    // Docs:
    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    throw error;
  }
}
