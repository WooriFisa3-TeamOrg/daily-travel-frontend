"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getPosts } from "../api/postApi";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { decode } from "next-auth/jwt";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const LikesList = () => {
    // const { data: session, status } = useSession();
    // const { data } = useSuspenseQuery(getPosts);

    const testarr = [1, 2, 3, 4];

    return (
        <main className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:p-6">
            {testarr.map((item) => {
                return (
                    <div
                        key={item}
                        className="relative overflow-hidden rounded-lg group border border-muted"
                    >
                        <Link
                            href={`/main/posts/${item}`}
                            className="absolute inset-0 z-10"
                            prefetch={false}
                        >
                            <span className="sr-only">View</span>
                        </Link>
                        <div className="flex items-center p-4 bg-background">
                            <Avatar className="mr-2">
                                <AvatarImage
                                    src="/placeholder-user.jpg"
                                    alt="@shadcn"
                                />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium">John Doe</div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <span>San Francisco</span>
                                        <Separator orientation="vertical" />
                                        <time>2 hours ago</time>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="z-20"
                            >
                                <HeartIcon className="w-4 h-4" />
                                <span className="sr-only">Like</span>
                            </Button>
                        </div>
                        <img
                            src="/150x150.png"
                            alt="Post 1"
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
                                Sunset Vibes
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                #photography #nature #sunset
                            </p>
                        </div>
                    </div>
                );
            })}
        </main>
    );
};

export default LikesList;
