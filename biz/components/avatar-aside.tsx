"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserInfoQuery } from "../api/users-api";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Suspense, useEffect, useState } from "react";
import { getQueryClient } from "../providers/get-query-client";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function AvatarAside() {
    const { data: session } = useSession();

    const { data } = useQuery(getUserInfoQuery(session?.user.id_token!));
    const [picture, setPicture] = useState("");
    useEffect(() => {
        console.log("PROFILE DATA");
        console.log(data);
        if (data) {
            console.log(data.profileImagePath);
            setPicture(data.profileImagePath);
        }
    }, [data, picture]);

    return (
        <Link href="/main/profile" prefetch={false}>
            <Avatar>
                <AvatarImage asChild src="/next.svg">
                    <Image src={picture} alt="avatar" width={40} height={40} />
                </AvatarImage>
                <AvatarFallback></AvatarFallback>
            </Avatar>
        </Link>
    );
}
