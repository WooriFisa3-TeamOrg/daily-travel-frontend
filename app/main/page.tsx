import PostList from "@/biz/components/post-list";
import SearchForm from "@/biz/components/search-form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { HeartIcon } from "lucide-react";
import Link from "next/link";

export default async function MainPage() {
    return (
        <div className="flex flex-1 flex-col">
            <SearchForm />
            <PostList />
        </div>
    );
}
