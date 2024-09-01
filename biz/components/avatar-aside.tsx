"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from "../api/users-api";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Suspense, useEffect, useState } from "react";
import { getQueryClient } from "../providers/get-query-client";
import Link from "next/link";
import Image from "next/image";

export default function AvatarAside() {
    const { data: session } = useSession();

    const { data } = useQuery(getUserInfo(session?.user.id_token!));
    const [picture, setPicture] = useState("");
    useEffect(() => {
        if (data) {
            console.log("PROFILE DATA");
            console.log(data);
            setPicture(data.data.profileImagePath);
        }
    }, [data, picture]);

    return (
        <Link href="/main/profile" prefetch={false}>
            <Avatar>
                <AvatarImage asChild src={picture}>
                    <Image src={picture} alt="avatar" width={40} height={40} />
                </AvatarImage>
                <AvatarFallback></AvatarFallback>
            </Avatar>
        </Link>
    );
}
