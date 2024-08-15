import { queryOptions } from "@tanstack/react-query";

export const getPosts = (id_token: string, page: number, count: number) => {
    console.log("GET USER INFO");
    return queryOptions({
        queryKey: ["user-info"],
        queryFn: async () => {
            const res = await fetch("http://localhost:3000/backend/v1/post", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${id_token}`,
                },
                body: JSON.stringify({
                    page: page,
                    count: count
                }),
                cache: "no-cache",

            });

            return res.json();
        },
    });
};
