import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        error: string;

        user: {
            /** The user's postal address. */
            // image?: string;
            id_token?: string;
        } & DefaultSession["user"];
    }
}
