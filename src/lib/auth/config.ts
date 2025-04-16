import { env } from "@/env";
import { NextAuthConfig } from "next-auth";
import "next-auth/jwt";
import { Provider } from "next-auth/providers";

/**
 * Definición del tipo de perfil específico de Clave Única, extendiendo el perfil base de NextAuth.
 */
type ClaveUnicaProfile = {
  sub: string; // RUT sin dígito verificador
  name: {
    nombres: string[];
    apellidos: string[];
  };
  RolUnico: {
    numero: number; // RUT sin dígito verificador
    DV: string; // Dígito verificador
    tipo: string; // Ejemplo: "RUN", "RUT", etc.
  };
};

/**
 * Configuración del proveedor de autenticación Clave Única utilizando OpenID Connect.
 */
const claveUnicaProvider: Provider = {
  id: "clave-unica",
  name: "Clave Única",
  type: "oidc",
  issuer: env.CLAVE_UNICA_URL,
  clientId: env.CLAVE_UNICA_CLIENT_ID,
  clientSecret: env.CLAVE_UNICA_CLIENT_SECRET,
  authorization: {
    params: {
      scope: "openid run name", // Scopes solicitados al proveedor
    },
  },
  idToken: false, // Indica si se debe solicitar el id_token (en este caso, no)
  checks: ["pkce", "nonce", "state"], // Mecanismos de seguridad adicionales
  /**
   * Callback que se ejecuta después de obtener el perfil del usuario desde Clave Única.
   * Permite transformar y adaptar el perfil según las necesidades de la aplicación.
   * El perfil resultante se utiliza en los callbacks `jwt` y `session`.
   *
   * @param profile - Perfil del usuario obtenido desde Clave Única.
   * @returns Objeto con el perfil adaptado para NextAuth.
   */
  profile(profile: ClaveUnicaProfile) {
    // Construir el nombre completo del usuario concatenando los nombres y apellidos
    const fullName =
      profile.name.nombres.join(" ") + " " + profile.name.apellidos.join(" ");

    // Construir el identificador único del usuario utilizando el número y dígito verificador del RUT
    const id = `${profile.RolUnico.numero}-${profile.RolUnico.DV}`;

    // Retornar el perfil adaptado con los campos requeridos por NextAuth
    return {
      id: id, // Identificador único del usuario (e.g., "12345678-9")
      sub: id, // Identificador de sujeto utilizado internamente
      name: fullName, // Nombre completo del usuario
      given_name:
        profile.name.nombres.length > 0 ? profile.name.nombres[0] : null, // Primer nombre
      family_name:
        profile.name.apellidos.length > 0
          ? profile.name.apellidos.join(" ")
          : null, // Apellidos
      middle_name:
        profile.name.nombres.length > 1
          ? profile.name.nombres.slice(1).join(" ")
          : null, // Nombres adicionales
      locale: "es-CL", // Configuración regional
      RolUnico: profile.RolUnico, // Información del RUT
      nombreRaw: profile.name, // Nombres y apellidos sin procesar
    };
  },
};

const providers = [claveUnicaProvider];

/**
 * Configuración principal de NextAuth.
 */
export const authConfig = {
  // Activar modo debug en entornos que no sean de producción
  debug: env.NODE_ENV === "production" ? false : true,
  // Proveedores de autenticación disponibles
  providers: providers,
  // Rutas personalizadas para páginas de autenticación
  pages: {
    signIn: "/", // Página personalizada de inicio de sesión
    error: "/auth/error", // Página personalizada de error
  },
  /**
   * Callbacks personalizados para manipular el token JWT y la sesión.
   */
  callbacks: {
    /**
     * Callback que se ejecuta al crear o actualizar el JWT utilizado para la sesión.
     * Permite agregar información adicional al token.
     *
     * @param trigger - Indica el evento que disparó el callback ("signIn", "update", "signUp").
     * @param token - El token JWT actual. Cuando el trigger es "signIn" y "signUp",
     * tiene un subset de datos como name, email e imagen,
     * para el trigger "update", el token tiene todos los datos del usuario.
     * @param account - Información de la cuenta del proveedor OAuth (disponible en "signIn" y "signUp").
     * @returns El token JWT modificado o sin cambios.
     *
     * @see https://next-auth.js.org/configuration/callbacks#jwt-callback
     */
    jwt({ trigger, token, account }) {
      // Si el usuario ha iniciado sesión con Clave Única, almacenamos su ID en el token JWT
      if (trigger === "signIn" && account?.provider === "clave-unica") {
        token.id = account.providerAccountId; // ID del usuario desde el proveedor
        token.sub = account.providerAccountId; // Asegurar que el sub sea consistente
      }
      return token;
    },
    /**
     * Callback que se ejecuta cada vez que se verifica una sesión.
     * Permite agregar o modificar datos en la sesión que será enviada al cliente.
     * Cuando la estrategia de sesión es JWT, este callback tiene el argumento JWT.
     * Cuando la estrategia de sesión es Database, este callback tiene el argumento User.
     *
     * @param session - La sesión actual que será enviada al cliente.
     * @param token - El token JWT, útil para obtener información adicional del usuario.
     * @returns La sesión modificada o sin cambios.
     *
     * @see https://next-auth.js.org/configuration/callbacks#session-callback
     */
    session({ session, token }) {
      // Agregar el ID del usuario a la sesión para que esté disponible en el cliente
      if (token?.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

/**
 * Extensión del módulo "next-auth/jwt" para agregar propiedades adicionales al token JWT.
 */
declare module "next-auth/jwt" {
  interface JWT {
    /**
     * Identificador único del usuario (por ejemplo, RUT con dígito verificador).
     */
    id?: string | null | undefined;
  }
}
