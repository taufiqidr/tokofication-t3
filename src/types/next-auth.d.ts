import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string;
      role?: "ADMIN" | "USER";
      balance?: number | null | undefined;
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    role?: "ADMIN" | "USER";
    balance?: number | null | undefined;
  }
}
