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

interface LayoutProps {}

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    console.log("SESSION");
    console.log(session);

    if (!session) {
        redirect("/logout");
    }

    if (session) {
        console.log(session.user.id_token);
        let statusCode = 0;
        try {
            //jwt validation
            const response = await fetch(
                "http://localhost:3000/backend/hello",
                {
                    headers: {
                        Authorization: `Bearer ${session.user.id_token}`,
                    },
                }
            );
            console.log(await response.text());
            console.log(response.status);
            statusCode = response.status;
        } catch (e) {
            console.log(e);
        }

        if (statusCode === 401) {
            redirect("/logout");
        }
    }

    return (
        // <div className="flex">
        <div className="flex min-h-screen w-full">
            <div>
                <div className="hidden flex-col border-r bg-background pl-20 pt-20 pr-10 h-full sm:flex">
                    <div className="flex flex-col items-start gap-4">
                        <div className="p-4">
                            <Avatar>
                                <AvatarImage
                                    src={session.user.image!}
                                    alt="avatar"
                                />
                                <AvatarFallback></AvatarFallback>
                            </Avatar>
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
                <div className="flex flex-col sm:hidden ">
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
                                    <div className="p-7">
                                        <Avatar>
                                            <AvatarImage
                                                src={session.user.image!}
                                                alt="avatar"
                                            />
                                            <AvatarFallback></AvatarFallback>
                                        </Avatar>
                                    </div>
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
