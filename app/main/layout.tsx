import Login from "@/biz/components/login";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SideBar from "@/biz/components/SideBar";

interface LayoutProps {}

export default async function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession();
    if (!session) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen">
            {/* 사이드바 */}
            <SideBar />

            {/* 콘텐츠 영역 */}
            <div id="contents" className="flex-1 p-6 lg:ml-64">
                {children}
            </div>
        </div>

        // <div>
        //     <div id="sidebar">
        //         <Login />
        //         <Link href="/main">
        //             <Button>홈으로 가기</Button>
        //         </Link>
        //         <Link href="/write">
        //             <Button>게시글 등록</Button>
        //         </Link>
        //         <Link href="/likes">
        //             <Button>즐겨찾기 목록</Button>
        //         </Link>
        //         <Link href="/profile">
        //             <Button>프로필</Button>
        //         </Link>
        //     </div>
        //     <div id="contents">{children}</div>
        // </div>
    );
}
