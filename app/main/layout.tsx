import Login from "@/biz/components/login";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    FilePenIcon,
    HomeIcon,
    MenuIcon,
    StarIcon,
    UserIcon,
    LogOutIcon,
} from "lucide-react";
import Logout from "@/biz/components/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { axiosInstance } from "@/biz/lib/axios";
import { authOptions } from "@/biz/lib/authOptions";
import { signOut } from "next-auth/react";
import { getQueryClient } from "@/biz/providers/get-query-client";
import { getUserInfo } from "@/biz/api/users-api";
import AvatarAside from "@/biz/components/avatar-aside";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface LayoutProps {}

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/logout");
    }

    if (session && session.error) {
        console.log(session.error);
        if (session.error === "RefreshAccessTokenError") {
            redirect("/logout");
        }
    }

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(getUserInfo(session.user.id_token!));

    return (
        // <div className="flex">
        <div className="flex min-h-screen w-full">
            <div>
                <div className="hidden flex-col border-r bg-background pl-20 pt-20 pr-10 h-full md:flex">
                    <div className="flex flex-col items-start gap-4">
                        <div className="p-4">
                            {/* <Avatar>
                                <AvatarImage
                                    src={session.user.image!}
                                    alt="avatar"
                                />
                                <AvatarFallback></AvatarFallback>
                            </Avatar> */}
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                <AvatarAside />
                            </HydrationBoundary>
                        </div>
                        <Link
                            href="/main"
                            className="flex items-center gap-2 text-lg font-semibold"
                            prefetch={false}
                        >
                            <HomeIcon className="h-6 w-6" />
                            Home
                        </Link>
                        <Link
                            href="/main/write"
                            className="flex items-center gap-2 text-lg font-semibold"
                            prefetch={false}
                        >
                            <FilePenIcon className="h-6 w-6" />
                            Write
                        </Link>
                        <Link
                            href="/main/likes"
                            className="flex items-center gap-2 text-lg font-semibold"
                            prefetch={false}
                        >
                            <StarIcon className="h-6 w-6" />
                            Favorites
                        </Link>
                        <Link
                            href="/main/profile"
                            className="flex items-center gap-2 text-lg font-semibold"
                            prefetch={false}
                        >
                            <UserIcon className="h-6 w-6" />
                            Profile
                        </Link>
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            <Logout />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:hidden ">
                    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-background px-4 ">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <MenuIcon className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="sm:max-w-xs">
                                <div className="flex flex-col items-start gap-4 p-4">
                                    <SheetClose asChild>
                                        <div className="p-7">
                                            <HydrationBoundary
                                                state={dehydrate(queryClient)}
                                            >
                                                <AvatarAside />
                                            </HydrationBoundary>
                                        </div>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href="/main"
                                            className="flex items-center gap-2 text-lg font-semibold"
                                            prefetch={false}
                                        >
                                            <HomeIcon className="h-6 w-6" />
                                            Home
                                        </Link>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <Link
                                            href="/main/write"
                                            className="flex items-center gap-2 text-lg font-semibold"
                                            prefetch={false}
                                        >
                                            <FilePenIcon className="h-6 w-6" />
                                            Write
                                        </Link>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <Link
                                            href="/main/likes"
                                            className="flex items-center gap-2 text-lg font-semibold"
                                            prefetch={false}
                                        >
                                            <StarIcon className="h-6 w-6" />
                                            Favorites
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href="/main/profile"
                                            className="flex items-center gap-2 text-lg font-semibold"
                                            prefetch={false}
                                        >
                                            <UserIcon className="h-6 w-6" />
                                            Profile
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Logout />
                                    </SheetClose>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </header>
                </div>
            </div>

            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
