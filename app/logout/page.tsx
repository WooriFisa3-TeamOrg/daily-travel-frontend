"use client";
import { signOut } from "next-auth/react";
import { FC, useEffect } from "react";

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
    useEffect(() => {
        signOut({
            redirect: true,
            callbackUrl: "/",
        });
    }, []);
    return <div></div>;
};

export default Page;
