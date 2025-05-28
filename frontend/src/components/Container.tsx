import { ReactNode } from "react";
import { cn } from "@/util/utils";

interface ContainerProps {
    className?: string

    children?: ReactNode
}

function Container({ className, children }: ContainerProps) {
    return (
        <div className={cn('mx-6 md:mx-24 lg:mx-32 xl:mx-48 2xl:mx-64', (className ? className : ''))}>
            {children}
        </div>
    );
}

export default Container;