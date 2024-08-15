"use client";

import { useInfiniteQuery, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "../api/post-api";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { decode } from "next-auth/jwt";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const PostList = () => {
    const { data: session } = useSession();
    const testarr = [1, 2, 3, 4];
    const [liked, setLiked] = useState(false);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({ pageParam = 0 }) => getPosts(session!.user.id_token!, pageParam, 20),
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

    const handleLike = (postId: number) => {
        setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
                            {/* <Avatar className="mr-2">
                                <AvatarImage
                                    src={post.authorImage || "/placeholder-user.jpg"}
                                    alt={post.author}
                                />
                                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                            </Avatar> */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">{post.author}</div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <span>{post.location}</span>
                                        <Separator orientation="vertical" />
                                        <time>{post.postedAt}</time>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleLike(post.id)}
                                className={`z-20 ${likedPosts[post.id] ? "text-red-500" : ""}`}
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
                            <h3 className="text-lg font-semibold md:text-xl">{post.title}</h3>
                            {post.hashtags.map((tag: string) => (
                                <p className="text-sm text-muted-foreground">#{tag}</p>

                            ))}
                        </div>
                    </div>
                ))
            )}
            <div ref={observerRef} className="w-full h-10 flex justify-center items-center">
                {isFetchingNextPage && <p>Loading more...</p>}
            </div>
        </main>
        // <main className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6">

        //     {testarr.map((item) => {
        //         return (
        //             <div
        //                 key={item}
        //                 className="relative overflow-hidden rounded-lg group border border-muted"
        //             >
        //                 <Link
        //                     href={`/main/posts/${item}`}
        //                     className="absolute inset-0 z-10"
        //                     prefetch={false}
        //                 >
        //                     <span className="sr-only">View</span>
        //                 </Link>
        //                 <div className="flex items-center p-4 bg-background">
        //                     <Avatar className="mr-2">
        //                         <AvatarImage
        //                             src="/placeholder-user.jpg"
        //                             alt="@shadcn"
        //                         />
        //                         <AvatarFallback>JD</AvatarFallback>
        //                     </Avatar>
        //                     <div className="flex-1">
        //                         <div className="flex items-center justify-between">
        //                             <div className="font-medium">John Doe</div>
        //                             <div className="flex items-center gap-1 text-xs text-muted-foreground">
        //                                 <span>San Francisco</span>
        //                                 <Separator orientation="vertical" />
        //                                 <time>2 hours ago</time>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <Button
        //                         variant="ghost"
        //                         size="icon"
        //                         onClick={() => setLiked(!liked)}
        //                         className={`z-20`}
        //                     >
        //                         <HeartIcon className="w-4 h-4" />
        //                         <span className="sr-only">Like</span>
        //                     </Button>
        //                 </div>
        //                 <img
        //                     src="/150x150.png"
        //                     alt="Post 1"
        //                     width={400}
        //                     height={300}
        //                     className="object-cover w-full h-60"
        //                     style={{
        //                         aspectRatio: "400/300",
        //                         objectFit: "cover",
        //                     }}
        //                 />
        //                 <div className="p-4 bg-background">
        //                     <h3 className="text-lg font-semibold md:text-xl">
        //                         Sunset Vibes
        //                     </h3>
        //                     <p className="text-sm text-muted-foreground">
        //                         #photography #nature #sunset
        //                     </p>
        //                 </div>
        //             </div>
        //         );
        //     })}
        // </main>
    );
};

export default PostList;
