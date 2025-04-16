import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET: z.string(),
    CLAVE_UNICA_URL: z
      .string()
      .url()
      .default("https://accounts.claveunica.gob.cl/openid"),
    CLAVE_UNICA_CLIENT_ID: z.string(),
    CLAVE_UNICA_CLIENT_SECRET: z.string(),
    WITH_REDIRECT: z
      .string()
      // transform to boolean using preferred coercion logic
      .transform((s) => s !== "false" && s !== "0")
      .default("false"),
    REDIRECT_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLAVE_UNICA_LOGOUT_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    CLAVE_UNICA_URL: process.env.CLAVE_UNICA_URL,
    NEXT_PUBLIC_CLAVE_UNICA_LOGOUT_URL:
      process.env.NEXT_PUBLIC_CLAVE_UNICA_LOGOUT_URL,
    CLAVE_UNICA_CLIENT_ID: process.env.CLAVE_UNICA_CLIENT_ID,
    CLAVE_UNICA_CLIENT_SECRET: process.env.CLAVE_UNICA_CLIENT_SECRET,
    WITH_REDIRECT: process.env.WITH_REDIRECT,
    REDIRECT_URL: process.env.REDIRECT_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
