"use client";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { doLike, getPosts } from "../api/post-api";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { timeAgo } from "@/biz/lib/time-util";
import { getQueryClient } from "../providers/get-query-client";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

const PostList = () => {
    const { data: session } = useSession();
    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});

    const { ref, inView } = useInView({
        triggerOnce: false, // 무한 스크롤을 위해 triggerOnce를 false로 설정
        threshold: 1.0,
    });

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: ["posts"],
            queryFn: ({ pageParam = 0 }) =>
                getPosts(session!.user.id_token!, pageParam, 20),
            initialPageParam: 0,
            getNextPageParam: (lastPage) => {
                return !lastPage.data.end ? lastPage.data.page + 1 : undefined;
            },
        });

    const queryClient = getQueryClient();

    const handleLike = async (postId: number) => {
        setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
        await doLike(session!.user.id_token!, postId);
        queryClient.invalidateQueries();
    };

    useEffect(() => {
        console.log("use effect", inView, hasNextPage);

        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    if (status === "pending") return <p>Loading...</p>;
    if (status === "error") return <p>Error loading posts.</p>;

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
                                {/* <AvatarImage
                                    src={post.authorProfile}
                                    alt={post.author}
                                /> */}
                                <AvatarImage asChild src={post.authorProfile}>
                                    <Image
                                        src={post.authorProfile}
                                        alt={post.author}
                                        width={40}
                                        height={40}
                                    />
                                </AvatarImage>
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
                        <Image
                            src={
                                post.imageFiles[0]?.includes("placekitten")
                                    ? "https://picsum.photos/663/488"
                                    : post.imageFiles[0]
                            }
                            alt={post.title}
                            width={302}
                            height={240}
                            className="object-cover w-full h-60"
                            style={{
                                aspectRatio: "400/300",
                                objectFit: "cover",
                            }}
                            priority={true}
                        />
                        <div className="p-4 bg-background">
                            <h3 className="text-lg font-semibold md:text-xl">
                                {post.title}
                            </h3>
                            {post.hashtags
                                .slice(0, 3)
                                .map((tag: string, index: number) => (
                                    <div
                                        key={index}
                                        className="w-fit bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground my-2"
                                    >
                                        #{tag}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))
            )}
            <div
                ref={ref}
                className="w-full h-10 flex justify-center items-center"
            >
                {isFetchingNextPage && <p>Loading more...</p>}
            </div>
        </main>
    );
};

export default PostList;
