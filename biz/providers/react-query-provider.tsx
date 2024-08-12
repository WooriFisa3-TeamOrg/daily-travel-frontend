"use client";

import {
    QueryClient,
    QueryClientProvider,
    isServer,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { getQueryClient } from "./get-query-client";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function ReactQueryProvider(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
                {props.children}
            </ReactQueryStreamedHydration>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
