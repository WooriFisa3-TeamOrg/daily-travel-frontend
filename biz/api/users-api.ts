import { queryOptions } from "@tanstack/react-query";
import { UserGetResponse } from "../types/User";

export const signIn = async (id_token: string): Promise<number> => {
    const res = await fetch("http://localhost:3000/backend/v1/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${id_token}`,
        },
    });

    return res.status;
};

// export const getUserInfo = async (
//     id_token: string
// ): Promise<UserGetResponse> => {
//     const res = await fetch("http://localhost:3000/backend/v1/user", {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${id_token}`,
//         },
//         //no cache
//         cache: "no-cache",
//     });

//     return res.json();
// };

export const getUserInfo = (id_token: string) => {
    console.log("GET USER INFO");
    return queryOptions({
        queryKey: ["user-info"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/backend/v1/user", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${id_token}`,
                },
                cache: "no-cache",
            });

            return res.json();
        },
    });
};
