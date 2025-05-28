import { cn } from "@/util/utils";
import { ReactNode } from "react";

interface SectionProps {
    title: string,
    children?: ReactNode,
    className?: string
}

function EditSection({ title, children, className }: SectionProps) {
    return (
        <div>
            <div className="text-dark text-2xl font-semibold">
                {title}
            </div>
            <div className={cn("mt-6", (className ? className : ""))}>
                {children}
            </div>
        </div>
    );
}

export default EditSection;