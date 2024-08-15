"use client";

import {
    useInfiniteQuery,
    useQuery,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { doLike, getLikedPosts, getPosts } from "../api/post-api";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { decode } from "next-auth/jwt";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { timeAgo } from "@/biz/lib/time-util";
import { axiosInstance } from "../lib/axios";
import { getQueryClient } from "../providers/get-query-client";

const LikeList = () => {
    const { data: session } = useSession();
    const [liked, setLiked] = useState(false);
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["posts-like"],
            queryFn: ({ pageParam = 0 }) =>
                getLikedPosts(session!.user.id_token!, pageParam, 20),
            initialPageParam: 0,
            getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        });

    const observerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!observerRef.current || !hasNextPage) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchNextPage();
                }
            },
            {
                root: null,
                rootMargin: "20px",
                threshold: 1.0,
            }
        );

        observer.observe(observerRef.current);

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [fetchNextPage, hasNextPage]);

    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});

    const queryClient = getQueryClient();

    const handleLike = async (postId: number) => {
        setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
        await doLike(session!.user.id_token!, postId);
        queryClient.invalidateQueries();
    };

    if (status === "pending") return <p>Loading...</p>;
    if (status === "error") return <p>Error loading posts.</p>;

    console.log(data);

    return (
        <main className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6">
            {data?.pages.map((page) =>
                page.data.postPreviewResponses.map((post: any) => (
                    <div
                        key={post.id}
                        className="relative overflow-hidden rounded-lg group border border-muted"
                    >
                        <Link
                            href={`/main/posts/${post.id}`}
                            className="absolute inset-0 z-10"
                            prefetch={false}
                        >
                            <span className="sr-only">View</span>
                        </Link>
                        <div className="flex items-center p-4 bg-background">
                            <Avatar className="mr-2">
                                <AvatarImage
                                    src={post.authorProfile}
                                    alt={post.author}
                                />
                                <AvatarFallback>
                                    {post.author.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="font-small">
                                        {post.author}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        {/* <span>San Francisco</span> */}
                                        <Separator orientation="vertical" />
                                        <time>
                                            {timeAgo(post.creationDate)}
                                        </time>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleLike(post.id)}
                                className={`z-20 ${
                                    likedPosts[post.id] ? "text-red-500" : ""
                                }`}
                            >
                                <HeartIcon className="w-4 h-4" />
                                <span className="sr-only">Like</span>
                            </Button>
                        </div>
                        <img
                            src={post.imageFiles[0] || "/150x150.png"}
                            alt={post.title}
                            width={400}
                            height={300}
                            className="object-cover w-full h-60"
                            style={{
                                aspectRatio: "400/300",
                                objectFit: "cover",
                            }}
                        />
                        <div className="p-4 bg-background">
                            <h3 className="text-lg font-semibold md:text-xl">
                                {post.title}
                            </h3>
                            {post.hashtags.map((tag: string, index: number) => {
                                if (index < 3)
                                    return (
                                        <div
                                            key={index}
                                            className="w-fit bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground my-2"
                                        >
                                            #{tag}
                                        </div>
                                    );
                            })}
                        </div>
                    </div>
                ))
            )}
            <div
                ref={observerRef}
                className="w-full h-10 flex justify-center items-center"
            >
                {isFetchingNextPage && <p>Loading more...</p>}
            </div>
        </main>
    );
};

export default LikeList;
