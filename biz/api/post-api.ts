import { queryOptions } from "@tanstack/react-query";

export const getPosts = async (
    id_token: string,
    page: number,
    count: number
) => {
    const res = await fetch(
        `http://localhost:3000/backend/v1/post?page=${page}&count=${count}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${id_token}`,
            },
            cache: "no-cache",
        }
    );

    return res.json();
};

export const getLikedPosts = async (
    id_token: string,
    page: number,
    count: number
) => {
    const res = await fetch(
        `http://localhost:3000/backend/v1/likes?page=${page}&count=${count}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${id_token}`,
            },
            cache: "no-cache",
        }
    );

    return res.json();
};

export const doLike = async (id_token: string, postId: number) => {
    const res = await fetch(`http://localhost:3000/backend/v1/likes`, {
        body: JSON.stringify({ postId }),
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${id_token}`,
        },
    });

    return res.status;
};
