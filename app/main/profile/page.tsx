import { getUserInfoQuery } from "@/biz/api/users-api";
import Profile from "@/biz/components/profile";
import { authOptions } from "@/biz/lib/authOptions";
import { getQueryClient } from "@/biz/providers/get-query-client";
import { UserGetResponse } from "@/biz/types/User";
import {
    dehydrate,
    HydrationBoundary,
    queryOptions,
} from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/logout");
    }

    const queryClient = getQueryClient();

    void queryClient.prefetchQuery(getUserInfoQuery(session.user.id_token!));

    return (
        <div className="flex justify-center">
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Profile />
            </HydrationBoundary>
        </div>
    );
}
