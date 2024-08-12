import { getPosts } from "@/biz/api/postApi";
import PostList from "@/biz/components/post-list";
import { getQueryClient } from "@/biz/providers/get-query-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { SparklesCore } from "@/components/ui/sparkles";
import Login from "@/biz/components/login";

export default async function Home() {
    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(getPosts);

    //자유 여행, 함께하는 일정 공유
    const words = [
        {
            text: "자유",
        },
        {
            text: "여행,",
        },
        {
            text: "함께하는",
        },
        {
            text: "일정",
        },
        {
            text: "공유",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];

    return (
        <section className="w-full py-12 md:py-24 lg:py-24 xl:py-24">
            {/* <div className="w-full absolute inset-0 h-screen -z-1">
                <SparklesCore
                    id="tsparticlesfullpage"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={100}
                    className="w-full h-full"
                    particleColor="#FFFFFF"
                />
            </div> */}
            <header className="flex items-center justify-between px-2 md:px-12">
                <div className="flex gap-2 items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={50}
                        height={24}
                        priority
                    />
                    <Link
                        href="#"
                        className="text-xl  font-bold md:text-2xl"
                        prefetch={false}
                    >
                        Daily Travel
                    </Link>
                </div>
                <div className="flex gap-2">
                    {/* <Button variant="outline">회원 가입</Button> */}
                    <Login />
                    <ModeToggle />
                </div>
            </header>
            <div className="container px-4 py-6 md:px-6 ">
                <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <img
                        src="/placeholder_introduce.webp"
                        alt="Hero"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                        width="500"
                        height="310"
                    />
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <TypewriterEffect
                                words={words}
                                className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-4xl whitespace-nowrap"
                            />
                            <p className=" text-muted-foreground md:text-xl">
                                나만의 여행 일정을 포스트로 올리고, 다른
                                여행자들과 공유해보세요. 여행 계획을 저장하고,
                                새로운 여행지를 함께 발견할 수 있는 최고의 여행
                                커뮤니티입니다.
                            </p>
                        </div>
                        <div className="w-full space-y-2">
                            <div className="flex gap-6 justify-center">
                                <Button
                                    variant="outline"
                                    className="px-6 py-3 border-2 text-lg  hover:bg-primary/90 "
                                >
                                    데모 영상
                                </Button>
                                <Button className="px-6 py-3  bg-primary text-lg text-primary-foreground hover:bg-primary/90">
                                    시작하기
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        // <main className="flex min-h-screen flex-col items-center justify-between p-24">
        //     <ModeToggle />
        //     <HydrationBoundary state={dehydrate(queryClient)}>
        //         <ProfileInfo />
        //         <PostList />
        //     </HydrationBoundary>
        // </main>
    );
}
