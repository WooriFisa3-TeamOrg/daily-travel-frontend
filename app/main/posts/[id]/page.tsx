"use client";
import { doLike } from "@/biz/api/post-api";
import { getQueryClient } from "@/biz/providers/get-query-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { HeartIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PostDetailPage() {
    const [like, setLike] = useState(false);
    const [comment, setComment] = useState("");
    const params = useParams();
    const { data: session } = useSession();
    const queryClient = getQueryClient();
    const { data: post } = useQuery({
        queryKey: ["post-detail", params.id],
        queryFn: async () => {
            const data = await fetch(
                `${process.env.NEXT_PUBLIC_HOST_NAME}/backend/v1/post/${params.id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user.id_token}`,
                    },
                    cache: "no-cache",
                }
            );
            return data.json();
        },
    });

    const handleLike = async () => {
        setLike(!like);
        await doLike(session!.user.id_token!, post.data.id);
        queryClient.invalidateQueries();
    };

    const { data: profile } = useQuery({
        queryKey: ["user-info"],
        queryFn: async () => {
            const res = await fetch(
                process.env.NEXT_PUBLIC_HOST_NAME + "/backend/v1/user",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.user.id_token}`,
                    },
                    cache: "no-cache",
                }
            );

            return res.json();
        },
    });
    console.log(post);
    console.log(profile);

    const writeCommentAction = async (postId: number, comment: string) => {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_HOST_NAME}/backend/v1/comments`,
            {
                body: JSON.stringify({ id: postId, content: comment }),
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user.id_token}`,
                },
            }
        );

        setComment("");

        return res.status;
    };

    // onclick button write comment
    const writeComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if ((e as any).key === "Enter") {
            return;
        }
        e.preventDefault();

        try {
            const response = await writeCommentAction(post.data.id, comment);

            console.log(response);
            if (response == 200) {
                toast({
                    title: "댓글 작성 완료",
                    description: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                });
                queryClient.invalidateQueries({
                    queryKey: ["post-detail", params.id],
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "댓글 작성 실패",
                    description: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "서버 오류",
                description: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            });
        }
    };

    if (!post) {
        return <div>error...</div>;
    }

    return (
        <div className="flex justify-center">
            <div className="bg-background rounded-lg border p-6 w-full max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-10 h-10 ">
                        <AvatarImage
                            src={post.data.authorProfileImagePath}
                            alt="@shadcn"
                            className="rounded-full"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{post.data.author}</div>
                        <div className="text-sm text-muted-foreground">
                            <time dateTime="2023-08-13 12:34:56">
                                {new Date(
                                    post.data.creationDate
                                ).toLocaleString()}
                            </time>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">{post.data.title}</h2>
                    <div className="text-sm text-muted-foreground">
                        <span>{post.data.placeName}</span>
                    </div>
                </div>
                <div className="mb-6">
                    <img
                        src={
                            post.data.images.length > 0
                                ? post.data.images[0]
                                : "/150x150.png"
                        }
                        width={800}
                        height={450}
                        alt="Yosemite National Park"
                        className="w-full rounded-lg object-cover aspect-[16/9]"
                    />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {post.data.images.map((image: string, index: number) => (
                        <img
                            key={`images_${index}`}
                            src={image}
                            width={300}
                            height={200}
                            alt="Yosemite National Park"
                            className="w-full rounded-lg object-cover aspect-[3/2]"
                        />
                    ))}
                </div>
                {/* TODO : 이미지 목록 뿌리기 */}
                {/* <div className="grid grid-cols-3 gap-4 mb-6">
                    <img
                        src="/150x150.png"
                        width={300}
                        height={200}
                        alt="Yosemite National Park"
                        className="w-full rounded-lg object-cover aspect-[3/2]"
                    />
                    <img
                        src="/150x150.png"
                        width={300}
                        height={200}
                        alt="Yosemite National Park"
                        className="w-full rounded-lg object-cover aspect-[3/2]"
                    />
                    <img
                        src="/150x150.png"
                        width={300}
                        height={200}
                        alt="Yosemite National Park"
                        className="w-full rounded-lg object-cover aspect-[3/2]"
                    />
                </div> */}
                <div className="flex items-center gap-2 mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            handleLike();
                        }}
                        className={`${like ? "text-red-500" : ""}`}
                    >
                        <HeartIcon className="w-5 h-5" />
                        <span className="sr-only">Like</span>
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        <span className="font-medium">
                            {post.data.likesCount}
                        </span>{" "}
                        likes
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.data.hashtags.map(
                        (hashtag: string, index: number) => (
                            <div
                                key={`hashtag_${index}`}
                                className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground"
                            >
                                #{hashtag}
                            </div>
                        )
                    )}
                    {/* <div className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground">
                        #yosemite
                    </div>
                    <div className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground">
                        #nationalpark
                    </div>
                    <div className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground">
                        #adventure
                    </div> */}
                </div>
                <div className="prose prose-gray dark:prose-invert">
                    <p> {post.data.content}</p>
                </div>
                <div className="mt-8 space-y-4">
                    <h3 className="text-xl font-bold">Comments</h3>
                    {/* 댓글 입력창 */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10 border rounded-full">
                                <AvatarImage
                                    src={profile.data.profileImagePath}
                                    alt="@shadcn"
                                    className="rounded-full"
                                />
                                <AvatarFallback>YO</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium">
                                        {profile.data.nickname}
                                    </div>
                                </div>
                                <Textarea
                                    placeholder="Write your comment..."
                                    className="rounded-md border border-muted px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    onChange={(e) => setComment(e.target.value)}
                                    value={comment}
                                />
                                <Button
                                    className="ml-auto"
                                    onClick={writeComment}
                                >
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                    {/* 댓글 */}

                    {post.data.comments.map((comment: any, index: number) => (
                        <div className="flex items-start gap-4">
                            <div
                                key={`comment_${index}`}
                                className="flex items-start gap-4"
                            >
                                <Avatar className="w-10 h-10 border rounded-full">
                                    <AvatarImage
                                        src={comment.profileImagePath}
                                        alt="@shadcn"
                                        className="rounded-full"
                                    />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="font-medium">
                                            {comment.nickname}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(
                                                comment.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    </div>
                                    <div>{comment.content}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
