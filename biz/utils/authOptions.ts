import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider, {
    KeycloakProfile,
} from "next-auth/providers/keycloak";
import { OAuthConfig } from "next-auth/providers/oauth";
import GoogleProvider from "next-auth/providers/google";
import { axiosInstance } from "@/biz/lib/axios";

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
                    // const response = await fetch(
                    //     process.env.RESOURCE_SERVER_URL + "/hello",
                    //     {
                    //         headers: {
                    //             Authorization: `Bearer ${account.id_token}`,
                    //         },
                    //         cache: "no-store",
                    //     }
                    // );
                    const response = await axiosInstance.get("/hello", {
                        headers: {
                            Authorization: `Bearer ${account.id_token}`,
                        },
                    });

                    console.log(response.status);
                    console.log(response.data);
                    // console.log(await response.text());
                } catch (e) {
                    console.error(e);
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
