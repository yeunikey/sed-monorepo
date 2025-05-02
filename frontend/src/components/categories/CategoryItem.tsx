import { useSearch } from "@/hooks/search";
import { Category } from "@/types";
import { useRouter } from "next/navigation";

interface CategoryProps {
    isActive: boolean,
    category: Category
}

function CategoryItem({ isActive, category }: CategoryProps) {
    const { setCategory } = useSearch();
    const router = useRouter();

    return (
        <div className={`relative text-dark py-3 text-nowrap cursor-pointer ${isActive ? '' : 'opacity-50'} hover:opacity-100`}
            onClick={() => {
                setCategory(category);
                router.push("/search?category_id=" + category.id)
            }}
        >
            {category.name}

            {isActive && (<div className="absolute bg-dark bottom-0 h-0.5 w-full" />)}
        </div>
    );
}

export default CategoryItem;