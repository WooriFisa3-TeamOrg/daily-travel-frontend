import { queryOptions } from "@tanstack/react-query";
import { UserGetResponse } from "../types/User";
import { redirect } from "next/navigation";

export const signIn = async (id_token: string): Promise<number> => {
    console.log("SIGN IN");
    const res = await fetch(
        process.env.NEXT_PUBLIC_HOST_NAME + "/backend/v1/user",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${id_token}`,
            },
        }
    );

    return res.status;
};

export const getUserInfo = async (
    id_token: string
): Promise<UserGetResponse> => {
    try {
        const res = await fetch(
            process.env.NEXT_PUBLIC_HOST_NAME + "/backend/v1/user",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${id_token}`,
                },
                cache: "no-cache",
            }
        );
        return res.json();
    } catch (e) {
        throw new Error("Error fetching user info");
    }
};

export const getUserInfoQuery = (id_token: string) => {
    console.log("GET USER INFO");
    return queryOptions({
        queryKey: ["user-info"],
        queryFn: async () => {
            const res = await fetch(
                process.env.NEXT_PUBLIC_HOST_NAME + "/backend/v1/user",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${id_token}`,
                    },
                    cache: "no-cache",
                }
            );
            // console.log("getUserInfoQuery");
            // console.log(await res.text());
            // console.log(res.status);

            return res.json();
        },
    });
};
