import { cn } from "@/util/utils";
import { MouseEventHandler } from "react";

interface ButtonProps {
    content: string,
    variant: "COLORED" | "STANDART",
    className?: string,
    onClick?: MouseEventHandler<HTMLDivElement>
}

function Button({ content, variant, className, onClick }: ButtonProps) {
    return (
        <div className={cn(
            "py-2 px-6 flex justify-center text-white cursor-pointer rounded-2xl hover:opacity-90 transition-all",
            variant == "COLORED" ? "bg-primary" : "bg-dark",
            className ? className : ""
        )}
            onClick={onClick}
        >
            {content}
        </div>
    );
}

export default Button;