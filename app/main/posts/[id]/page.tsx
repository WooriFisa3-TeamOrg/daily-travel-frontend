"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { HeartIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
    const params = useParams();
    console.log(params);

    return (
        <div className="flex justify-center">
            <div className="bg-background rounded-lg border p-6 w-full max-w-2xl">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-10 h-10 border">
                        <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">Olivia Davis</div>
                        <div className="text-sm text-muted-foreground">
                            <time dateTime="2023-08-13T12:34:56Z">
                                August 13, 2023
                            </time>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <h2 className="text-2xl font-bold">
                        Exploring the Wonders of Yosemite National Park
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        <span>Yosemite National Park</span>
                    </div>
                </div>
                <div className="mb-6">
                    <img
                        src="/150x150.png"
                        width={800}
                        height={450}
                        alt="Yosemite National Park"
                        className="w-full rounded-lg object-cover aspect-[16/9]"
                    />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
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
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="ghost" size="icon">
                        <HeartIcon className="w-5 h-5" />
                        <span className="sr-only">Like</span>
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        <span className="font-medium">123</span> likes
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground">
                        #yosemite
                    </div>
                    <div className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground">
                        #nationalpark
                    </div>
                    <div className="bg-muted rounded-full px-3 py-1 text-sm text-muted-foreground">
                        #adventure
                    </div>
                </div>
                <div className="prose prose-gray dark:prose-invert">
                    <p>
                        Yosemite National Park is a true wonder of nature, with
                        its towering granite cliffs, cascading waterfalls, and
                        lush forests. As I explored this magnificent landscape,
                        I was struck by the sheer beauty and grandeur that
                        surrounded me.
                    </p>
                    <p>
                        From the iconic Half Dome to the serene Tuolumne
                        Meadows, every step I took revealed new and breathtaking
                        vistas. The park's diverse ecosystems, home to a rich
                        array of wildlife, only added to the sense of awe and
                        wonder.
                    </p>
                    <p>
                        As I hiked through the trails, I couldn't help but feel
                        a deep connection to the natural world. The tranquility
                        and solitude of the park provided a much-needed respite
                        from the hustle and bustle of everyday life, allowing me
                        to truly appreciate the beauty and power of the great
                        outdoors.
                    </p>
                    <p>
                        Yosemite is a place that has the power to inspire, to
                        challenge, and to transform. It is a testament to the
                        enduring beauty of our planet, and a reminder of the
                        importance of preserving and protecting these natural
                        wonders for generations to come.
                    </p>
                </div>
                <div className="mt-8 space-y-4">
                    <h3 className="text-xl font-bold">Comments</h3>
                    {/* 댓글 입력창 */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10 border">
                                <AvatarImage
                                    src="/placeholder-user.jpg"
                                    alt="@shadcn"
                                />
                                <AvatarFallback>YO</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium">Your Name</div>
                                    <div className="text-xs text-muted-foreground">
                                        Just now
                                    </div>
                                </div>
                                <Textarea
                                    placeholder="Write your comment..."
                                    className="rounded-md border border-muted px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <Button className="ml-auto">Post</Button>
                            </div>
                        </div>
                    </div>
                    {/* 댓글 */}
                    <div className="flex items-start gap-4">
                        <Avatar className="w-10 h-10 border">
                            <AvatarImage
                                src="/placeholder-user.jpg"
                                alt="@shadcn"
                            />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2">
                                <div className="font-medium">John Doe</div>
                                <div className="text-xs text-muted-foreground">
                                    2 days ago
                                </div>
                            </div>
                            <div>
                                Wow, this looks like an amazing trip! I've
                                always wanted to visit Yosemite. Your photos are
                                stunning.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
