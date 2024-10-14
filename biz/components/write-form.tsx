"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FC, useRef, useState } from "react";
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

interface WriteFormProps {}

const WriteForm: FC<WriteFormProps> = ({}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFiles, setImageFiles] = useState<File[] | null>(null);
    const [hashtags, setHashtags] = useState<string[]>([]);
    const { data: session } = useSession();
    const queryClient = getQueryClient();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageDelete = (index: number) => {
        if (imageFiles) {
            const updatedImages = imageFiles.filter(
                (_, imgIndex) => imgIndex !== index
            );
            setImageFiles(updatedImages);
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
            setImageFiles(updatedFiles);
        } else {
            if (newFiles.length > 10) {
                toast({
                    variant: "destructive",
                    title: "이미지 업로드 제한",
                    description: "최대 10개의 이미지만 업로드할 수 있습니다.",
                });
                return;
            }
            setImageFiles([...newFiles]);
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
                                    key={`hashtag_${index}`}
                                    className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground w-fit cursor-pointer"
                                    onClick={() =>
                                        setHashtags(
                                            hashtags.filter(
                                                (_, idx) => idx !== index
                                            )
                                        )
                                    }
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

export default WriteForm;
