"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CameraIcon, CheckIcon, FilePenIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import { getUserInfo } from "../api/users-api";
import { UserGetResponse } from "../types/User";
import { getQueryClient } from "../providers/get-query-client";
import { axiosInstance } from "../lib/axios";
import { timeAgo } from "../lib/time-util";
import { Separator } from "@/components/ui/separator";

interface ProfileProps {}

const Profile: FC<ProfileProps> = ({}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [picture, setPicture] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const { data: session, status } = useSession();

    const queryClient = getQueryClient();
    const { data } = useQuery(getUserInfo(session?.user.id_token!));
    console.log(data);

    const [queryLoaded, setQueryLoaded] = useState(false);

    const mutation = useMutation({
        mutationFn: async () => {
            try {
                console.log("MUTATION PROFILE");
                let formData = new FormData();
                if (imageFile) formData.append("profileImageFile", imageFile);
                formData.append("nickname", name);
                const { data } = await axiosInstance.put("/v1/user", formData, {
                    headers: {
                        Authorization: `Bearer ${session?.user.id_token}`,
                    },
                });
                console.log(data);
                setPicture(data.data.profileImagePath);
            } catch (e) {
                console.log(e);
            }
        },
        onSuccess: async () => {
            // return await queryClient.invalidateQueries({
            //     queryKey: ["user-info"],
            // });

            return await queryClient.invalidateQueries();
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("IMAGE CHANGE");
        const file = e.target.files?.[0];
        console.log(file);
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setPicture(imageUrl);
            setIsEditing(false);
            mutation.mutate();
        }
    };

    useEffect(() => {
        if (data) {
            console.log("PROFILE DATA");
            console.log(data);
            setName(data.data.nickname);
            setPicture(data.data.profileImagePath);
            setQueryLoaded(true);
        }
    }, [data]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <div>Please sign in</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen ">
            <div className="max-w-3xl w-full px-4 md:px-6">
                <div className="bg-background rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative h-48 md:h-64 bg-primary">
                        <img
                            src="/placeholder_profile.webp"
                            alt="Cover image"
                            width={1200}
                            height={400}
                            className="object-cover w-full h-full"
                            style={{
                                aspectRatio: "1200/400",
                                objectFit: "cover",
                            }}
                        />
                        <div className="absolute inset-0  flex items-center justify-center">
                            <div className="relative">
                                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background">
                                    <AvatarImage src={picture} alt="@shadcn" />
                                    <AvatarFallback>
                                        {/* {session?.user.name} */}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <>
                                        <label
                                            htmlFor="profile-image-upload"
                                            className="absolute top-0 right-0 -translate-x-2 -translate-y-2 rounded-full cursor-pointer"
                                        >
                                            <span className="sr-only">
                                                Edit profile image
                                            </span>
                                            <input
                                                id="profile-image-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                ref={hiddenFileInput}
                                            />
                                        </label>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute top-0 right-0 -translate-x-2 -translate-y-2 rounded-full"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                hiddenFileInput.current!.click();
                                            }}
                                        >
                                            <CameraIcon className="w-5 h-5 text-white" />
                                            <span className="sr-only">
                                                Save profile
                                            </span>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-6 md:p-8 grid gap-6">
                        <div className="flex items-center justify-between">
                            <div className="grid gap-1">
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="text-2xl md:text-3xl font-bold"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="rounded-full"
                                            onClick={() => {
                                                setIsEditing(false);
                                                mutation.mutate();
                                            }}
                                        >
                                            <CheckIcon className="w-5 h-5" />
                                            <span className="sr-only">
                                                Save name
                                            </span>
                                        </Button>
                                    </div>
                                ) : (
                                    <h1 className="text-2xl md:text-3xl font-bold">
                                        {name}
                                    </h1>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <FilePenIcon className="w-5 h-5" />
                                <span className="sr-only">Edit profile</span>
                            </Button>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <h2 className="text-lg md:text-xl font-semibold">
                                    Latest Favorites
                                </h2>
                                {queryLoaded &&
                                    data.data.likedPosts.map((post: any) => (
                                        <div
                                            key={post.id}
                                            className="relative overflow-hidden rounded-lg group border border-muted"
                                        >
                                            <Link
                                                href={`/main/posts/${post.id}`}
                                                className="absolute inset-0 z-10"
                                                prefetch={false}
                                            >
                                                <span className="sr-only">
                                                    View
                                                </span>
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
                                                                {timeAgo(
                                                                    post.creationDate
                                                                )}
                                                            </time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <img
                                                src={
                                                    post.imageFiles[0] ||
                                                    "/150x150.png"
                                                }
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
                                                {post.hashtags.map(
                                                    (
                                                        tag: string,
                                                        index: number
                                                    ) => {
                                                        if (index < 3)
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className="w-fit bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground my-2"
                                                                >
                                                                    #{tag}
                                                                </div>
                                                            );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div className="grid gap-2">
                                <h2 className="text-lg md:text-xl font-semibold">
                                    Latest Post
                                </h2>
                                {queryLoaded && data?.data.recentPost && (
                                    <div className="relative overflow-hidden rounded-lg group border border-muted">
                                        <Link
                                            href={`/main/posts/${data?.data.recentPost?.id}`}
                                            className="absolute inset-0 z-10"
                                            prefetch={false}
                                        >
                                            <span className="sr-only">
                                                View
                                            </span>
                                        </Link>
                                        <div className="flex items-center p-4 bg-background">
                                            <Avatar className="mr-2">
                                                <AvatarImage
                                                    src={
                                                        data?.data.authorProfile
                                                    }
                                                    alt={
                                                        data?.data.recentPost
                                                            .author
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {data?.data.recentPost.author.charAt(
                                                        0
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div className="font-small">
                                                        {
                                                            data?.data
                                                                .recentPost
                                                                .author
                                                        }
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        {/* <span>San Francisco</span> */}
                                                        <Separator orientation="vertical" />
                                                        <time>
                                                            {timeAgo(
                                                                data?.data
                                                                    .recentPost
                                                                    .creationDate
                                                            )}
                                                        </time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <img
                                            src={
                                                data?.data.recentPost
                                                    .imageFiles[0] ||
                                                "/150x150.png"
                                            }
                                            alt={data?.data.recentPost.title}
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
                                                {data?.data.recentPost.title}
                                            </h3>
                                            {data?.data.recentPost.hashtags.map(
                                                (
                                                    tag: string,
                                                    index: number
                                                ) => {
                                                    if (index < 3)
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="w-fit bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground my-2"
                                                            >
                                                                #{tag}
                                                            </div>
                                                        );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
