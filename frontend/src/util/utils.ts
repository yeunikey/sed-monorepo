import { twMerge } from "tailwind-merge"

const cn = (...className: string[]) => {
    return twMerge(className);
}

export {
    cn
}