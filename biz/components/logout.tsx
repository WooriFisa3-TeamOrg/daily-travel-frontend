"use client";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { FC } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

interface LogoutProps {}

const Logout: FC<LogoutProps> = ({}) => {
    return (
        <Button
            className="bg-red-600 text-red-700 hover:bg-red-700 flex items-center gap-2 p-0"
            onClick={() => {
                signOut();
            }}
        >
            <LogOutIcon className="h-5 w-5" color="#ff0000" />
            Logout
        </Button>
    );
};

export default Logout;
