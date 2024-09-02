"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FC, useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getQueryClient } from "../providers/get-query-client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";

interface ModifyFormProps {}

const ModifyForm: FC<ModifyFormProps> = ({}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const params = useParams();
    const { data: session } = useSession();
    const queryClient = getQueryClient();

    const { data: post, status } = useQuery({
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

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageDelete = (index: number) => {
        if (imageFiles) {
            const updatedImages = Array.from(imageFiles).filter(
                (_, imgIndex) => imgIndex !== index
            );

            const dataTransfer = new DataTransfer();
            updatedImages.forEach((file) => dataTransfer.items.add(file));
            setImageFiles(dataTransfer.files);
        }
    };

    const handleImageUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newFiles = Array.from(e.target.files);
        if (imageFiles) {
            const currentFiles = Array.from(imageFiles);
            const totalFiles = currentFiles.length + newFiles.length;
            if (totalFiles > 10) {
                toast({
                    variant: "destructive",
                    title: "이미지 업로드 제한",
                    description: "최대 10개의 이미지만 업로드할 수 있습니다.",
                });
                return;
            }
            const updatedFiles = [...currentFiles, ...newFiles];
            const dataTransfer = new DataTransfer();
            updatedFiles.forEach((file) => dataTransfer.items.add(file));
            setImageFiles(dataTransfer.files);
        } else {
            if (newFiles.length > 10) {
                toast({
                    variant: "destructive",
                    title: "이미지 업로드 제한",
                    description: "최대 10개의 이미지만 업로드할 수 있습니다.",
                });
                return;
            }
            const dataTransfer = new DataTransfer();
            newFiles.forEach((file) => dataTransfer.items.add(file));
            setImageFiles(dataTransfer.files);
        }
    };

    const handleHashtagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const newHashtag = (e.target as HTMLInputElement).value.trim();
            if (newHashtag) {
                setHashtags([...hashtags, newHashtag]);
                (e.target as HTMLInputElement).value = "";
            }
        }
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if ((e as any).key === "Enter") {
            return;
        }
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("placeName", placeName);
        if (imageFiles) {
            Array.from(imageFiles).forEach((image) =>
                formData.append("imageFiles", image)
            );
        }
        hashtags.forEach((hashtag) => {
            formData.append("hashtags", hashtag);
        });

        try {
            const response = await axiosInstance.post("/v1/post", formData, {
                headers: {
                    Authorization: `Bearer ${session?.user.id_token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Post submitted successfully!");
            toast({
                title: "게시글 작성 완료",
                description: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            });
            queryClient.invalidateQueries();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "서버 오류",
                description: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // 엔터키 입력을 방지
        }
    };

    useEffect(() => {
        if (post && post.data.mine) {
            setTitle(post.data.title);
            setContent(post.data.content);
            setPlaceName(post.data.placeName);
            setHashtags(post.data.hashtags);

            // const images = post.data.images;
            // const imageFiles = images.map((image: string) => {
            //     return fetch(
            //         `${
            //             process.env.NEXT_PUBLIC_HOST_NAME
            //         }/_next/image?url=${encodeURIComponent(image)}&w=384&q=75`
            //     ).then((res) => res.blob());
            // });
            // setImageFiles(imageFiles);
        }
    }, [post]);

    if (status === "success") {
        if (post && !post.data.mine) {
            return (
                <Card className="w-full max-w-lg sm:max-w-5xl">
                    <CardContent className="py-4">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">권한 없음</h1>
                            <p>본인 게시글만 수정할 수 있습니다.</p>
                        </div>
                    </CardContent>
                </Card>
            );
        }
    }

    return (
        <Card className="w-full max-w-lg sm:max-w-5xl">
            <CardContent className="py-4">
                <form
                    onSubmit={(e) => e.preventDefault()}
                    onKeyDown={handleKeyDown}
                >
                    <div className="py-2">
                        <Label htmlFor="title">제목</Label>
                        <Input
                            id="title"
                            placeholder="Enter place name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="py-2">
                        <Label htmlFor="title">내용</Label>
                        <Textarea
                            id="contents"
                            placeholder="Write your comment..."
                            className="rounded-md border border-muted px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="py-2">
                        <Label htmlFor="place">장소 이름</Label>
                        <Input
                            id="place"
                            placeholder="Enter place details"
                            value={placeName}
                            onChange={(e) => setPlaceName(e.target.value)}
                        />
                    </div>
                    <div className="py-2">
                        <Label htmlFor="image">사진 업로드</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={handleImageUploadClick}
                            >
                                이미지 선택
                            </Button>
                            <span>{imageFiles ? imageFiles.length : 0}/10</span>
                            <Input
                                type="file"
                                multiple
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="hidden"
                            />
                        </div>
                    </div>
                    {imageFiles && (
                        <div className="space-y-1">
                            <Carousel>
                                <CarouselContent>
                                    {Array.from(imageFiles).map(
                                        (image, imgIndex) => (
                                            <CarouselItem
                                                key={imgIndex}
                                                className="relative basis-1/3"
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        image
                                                    )}
                                                    alt="image"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                ></img>
                                                <Button
                                                    className="absolute top-2 right-2 bg-red-500 text-white"
                                                    onClick={() =>
                                                        handleImageDelete(
                                                            imgIndex
                                                        )
                                                    }
                                                >
                                                    <X />
                                                </Button>
                                            </CarouselItem>
                                        )
                                    )}
                                </CarouselContent>

                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    )}
                    <div className="py-2">
                        <Label htmlFor="hashtag">해시태그</Label>
                        <Input
                            placeholder="Enter hashtags"
                            onKeyDown={handleHashtagInput}
                        />
                    </div>
                    {hashtags.length > 0 && (
                        <div className="space-y-1">
                            <Label>Hashtag List:</Label>
                            {hashtags.map((hashtag, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2"
                                >
                                    <span>#{hashtag}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="py-5 flex w-full">
                        <Button className="ml-auto" onClick={handleSubmit}>
                            Post
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ModifyForm;
