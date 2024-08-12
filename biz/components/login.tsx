"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Login() {
    const { data } = useSession();

    if (data) {
        return (
            <>
                <Avatar>
                    <AvatarImage src={data.user.image!} alt="avatar" />
                    <AvatarFallback></AvatarFallback>
                </Avatar>
                <Button onClick={() => signOut()}>로그아웃</Button>
            </>
        );
    }
    return (
        <>
            <Button onClick={() => signIn("google")}>로그인</Button>
        </>
    );
}
