import { cn } from "@/util/utils";
import { ChangeEventHandler, FormEventHandler, HTMLInputTypeAttribute, Ref } from "react";

interface InputProps {
    ref?: Ref<HTMLInputElement>
    type: HTMLInputTypeAttribute,
    placeholder?: string,
    className?: string,
    defaultValue?: string | number,
    accept?: string,
    onInput?: FormEventHandler<HTMLInputElement>,
    value?: string,
    onChange?: ChangeEventHandler<HTMLInputElement>,
    inputMode?: "email" | "search" | "tel" | "text" | "url" | "none" | "numeric" | "decimal"
}

function Input(p: InputProps) {
    return (
        <input
            ref={p.ref}
            type={p.type}
            placeholder={p.placeholder}
            onInput={p.onInput}
            defaultValue={p.defaultValue}
            accept={p.accept}
            inputMode={p.inputMode}
            className={cn(
                "rounded-2xl py-3 px-6 text-dark text-base w-full outline-solid outline-2 bg-muted outline-transparent focus:outline-primary placeholder:text-dark-gray",
                p.className ? p.className : ''
            )}
            value={p.value}
            onChange={p.onChange}
        />
    );
}

export default Input;