'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient()

interface QueryProps {
    children?: ReactNode
}

function QueryComponent({ children }: QueryProps) {
    return (  
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default QueryComponent;