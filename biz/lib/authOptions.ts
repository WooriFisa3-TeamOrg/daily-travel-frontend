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
        id_token: string;
        provider: string;
        refresh_token: string;
        accessTokenExpires: number;
        error: string;
    }
}

async function refreshAccessToken(token: JWT) {
    try {
        console.log("Refreshing access token");
        const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token!,
            }),
        });

        const tokensOrError = await response.json();
        console.log("tokensOrError", tokensOrError);

        if (!response.ok) throw tokensOrError;

        const newTokens = tokensOrError as {
            id_token: string;
            access_token: string;
            expires_in: number;
            refresh_token?: string;
        };

        token.id_token = newTokens.id_token;
        token.access_token = newTokens.access_token;
        token.expires_at = Math.floor(Date.now() / 1000 + newTokens.expires_in);
        // Some providers only issue refresh tokens once, so preserve if we did not get a new one
        if (newTokens.refresh_token)
            token.refresh_token = newTokens.refresh_token;

        console.log("Access token refreshed", token);

        return token;
    } catch (error) {
        console.log(error);

        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
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
            checks: ["none"],
            authorization: {
                params: { access_type: "offline", prompt: "consent" },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account) {
                token.id_token = account.id_token!;
                token.provider = account.provider!;
                token.refresh_token = account.refresh_token!;

                token.accessTokenExpires = account.expires_at! * 1000;

                console.log("JWT", token.id_token);
                console.log("expires_at", account.expires_at! * 1000);
            }

            console.log("date");
            console.log(Date.now());
            console.log(token.accessTokenExpires);
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id_token: token.id_token,
            };
            session.error = token.error;

            console.log("id_token", token.id_token);

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
