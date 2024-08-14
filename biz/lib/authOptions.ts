import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider, {
    KeycloakProfile,
} from "next-auth/providers/keycloak";
import { OAuthConfig } from "next-auth/providers/oauth";
import GoogleProvider from "next-auth/providers/google";
import { axiosInstance } from "@/biz/lib/axios";
import { redirect } from "next/navigation";
import { signIn } from "@/biz/api/users-api";

declare module "next-auth/jwt" {
    interface JWT {
        id_token?: string;
        provider?: string;
    }
}
export const authOptions: AuthOptions = {
    providers: [
        // KeycloakProvider({
        //     clientId: process.env.KEYCLOAK_CLIENT_ID,
        //     clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
        //     issuer: process.env.KEYCLOAK_ISSUER,
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account) {
                token.id_token = account.id_token;
                token.provider = account.provider;
            }

            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id_token: token.id_token,
            };

            return session;
        },
    },
    events: {
        async signIn({ user, account, profile }) {
            // console.log(user);
            // console.log(account);
            // console.log("Sign in", profile);
            if (account) {
                try {
                    console.log("Fetching /hello with access token");
                    console.log(account.id_token);

                    //sign in
                    // const response = await axiosInstance.post("/v1/user", {
                    //     headers: {
                    //         "Cache-Control": "no-cache",
                    //         Authorization: `Bearer ${account.id_token}`,
                    //         "Content-Type": "application/json",
                    //     },
                    // });
                    // const response = await fetch(
                    //     "http://localhost:3000/backend/v1/user",
                    //     {
                    //         method: "POST",
                    //         headers: {
                    //             "Cache-Control": "no-cache",
                    //             Authorization: `Bearer ${account.id_token}`,
                    //             "Content-Type": "application/json",
                    //         },
                    //     }
                    // );
                    const status = await signIn(account.id_token!);
                    console.log("Sign in status", status);
                } catch (e) {
                    console.error((e as any).message);
                }
            }
        },
        async signOut({ token }: { token: JWT }) {
            if (token.provider === "keycloak") {
                const issuerUrl = (
                    authOptions.providers.find(
                        (p) => p.id === "keycloak"
                    ) as OAuthConfig<KeycloakProfile>
                ).options!.issuer!;
                const logOutUrl = new URL(
                    `${issuerUrl}/protocol/openid-connect/logout`
                );
                logOutUrl.searchParams.set("id_token_hint", token.id_token!);

                console.log("Logging out from Keycloak", logOutUrl.toString());
                await fetch(logOutUrl);
            }
        },
    },
};
