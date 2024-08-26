"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface SearchFormProps {}

const SearchForm: FC<SearchFormProps> = ({}) => {
    const searchParams = useSearchParams();
    const { replace, push } = useRouter();

    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams);
        params.set("search", query);

        push(`/main/search?${params.toString()}`);
    };

    return (
        <div>
            <form
                className="flex items-center justify-center w-full"
                onSubmit={handleSubmit}
            >
                <Input
                    type="text"
                    placeholder="Search"
                    className="w-1/2 p-2  rounded-lg"
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" className="p-2 ml-2  rounded-lg">
                    Search
                </Button>
            </form>
        </div>
    );
};

export default SearchForm;
