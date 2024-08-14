"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FC, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface WriteFormProps {}

const WriteForm: FC<WriteFormProps> = ({}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [hashtag, setHashtag] = useState("");
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        formData.append("hashtag", hashtag);

        try {
            const response = await axiosInstance.post("/v1/post", formData, {
                headers: {
                    Authorization: `Bearer ${session?.user.id_token}`,
                },
            });

            if (response.status === 201) {
                console.log("Post submitted successfully!");
                toast({
                    title: "게시글 작성 완료",
                    description: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                });
            } else {
                console.error("Failed to submit post");
                toast({
                    variant: "destructive",
                    title: "서버 오류",
                    description: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
                });
            }
        } catch (error) {
            console.error(
                "An error occurred while submitting the post:",
                error
            );
        }
    };
    return (
        <Card className="w-full max-w-lg">
            <CardContent className="py-4">
                <form onSubmit={handleSubmit}>
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
                        <Input
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={(e) => setImageFiles(e.target.files)}
                        />
                    </div>
                    <div className="py-2">
                        <Label htmlFor="hashtag">해시태그</Label>
                        <Input
                            placeholder="Enter hashtags"
                            value={hashtag}
                            onChange={(e) => setHashtag(e.target.value)}
                        />
                    </div>
                    <div className="py-5 flex w-full">
                        <Button type="submit" className="ml-auto">
                            Post
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default WriteForm;
