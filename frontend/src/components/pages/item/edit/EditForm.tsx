import { cn } from "@/util/utils";
import { ReactNode } from "react";

interface FormProps {
    children?: ReactNode,
    text: string,
    className?: string
}

function EditForm({ text, children, className }: FormProps) {
    return (
        <div className="w-full grid grid-cols-2 gap-6">
            <div className="text-lg text-dark-light-gray flex items-center">
                {text}
            </div>

            <div className={cn('flex justify-end', className)}>
                {children}
            </div>
        </div>
    );
}

export default EditForm;