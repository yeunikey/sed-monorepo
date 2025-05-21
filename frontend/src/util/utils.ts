import { ClassNameValue, twMerge } from "tailwind-merge"

const cn = (...className: ClassNameValue[]) => {
    return twMerge(className);
}

export {
    cn
}