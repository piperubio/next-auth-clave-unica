import { env } from "@/env";
import { redirect } from "next/navigation";

export default function PrivateRedirect() {
  return redirect(env.REDIRECT_URL);
}
