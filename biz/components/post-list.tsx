"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "../api/postApi";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { decode } from "next-auth/jwt";

const PostList = () => {
    const { data: session, status } = useSession();
    const { data } = useSuspenseQuery(getPosts);

    // useEffect(() => {
    //     if (
    //       status == "unauthenticated" ||
    //       (status == "authenticated" && !session?.includes("client_user"))
    //     ) {
    //       router.push("/unauthorized");
    //       router.refresh();
    //     }
    //   }, [session, status, router]);

    return (
        <div>
            <h1>Posts</h1>
            <hr></hr>
            <ul>
                {data?.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;
