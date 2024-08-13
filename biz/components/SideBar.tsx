"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC, useState } from "react";
import Login from "./login";

interface SideBarProps {}

const SideBar: FC<SideBarProps> = async ({}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* 사이드바 */}
            <div
                className={`fixed inset-0 bg-gray-800 text-white p-4 space-y-4 lg:static lg:w-64 lg:bg-gray-800 lg:text-white lg:p-4 lg:space-y-4 transition-transform transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Login />
                <nav className="space-y-2">
                    <Link href="/main">
                        <Button variant="outline" className="w-full">
                            홈으로 가기
                        </Button>
                    </Link>
                    <Link href="/write">
                        <Button variant="outline" className="w-full">
                            게시글 등록
                        </Button>
                    </Link>
                    <Link href="/likes">
                        <Button variant="outline" className="w-full">
                            즐겨찾기 목록
                        </Button>
                    </Link>
                    <Link href="/profile">
                        <Button variant="outline" className="w-full">
                            프로필
                        </Button>
                    </Link>
                </nav>
            </div>
            {/* 햄버거 버튼 */}

            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 text-white bg-gray-800 rounded"
                onClick={toggleSidebar}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                </svg>
            </button>
        </>
    );
};

export default SideBar;
