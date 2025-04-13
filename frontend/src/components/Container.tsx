import { cn } from "@/util/utils";
import { ReactNode } from "react";

interface ContainerProps {
    className?: string

    children?: ReactNode
}

function Container({ className, children }: ContainerProps) {
    return (
        <div className={cn('mx-6 md:mx-24', (className ? className : ''))}>
            {children}
        </div>
    );
}

export default Container;