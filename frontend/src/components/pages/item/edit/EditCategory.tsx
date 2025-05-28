import { Category, SubCategory } from "@/types";

import Image from "next/image";

interface CategoryProps {
    category: Category,
    selectedCategory: Category | null,
    selectedSubCategory: SubCategory | null,
    setSelectedCategory: (category: Category | null) => void,
    setSelectedSubCategory: (subcategory: SubCategory | null) => void
}

function EditCategory({ category, selectedCategory, selectedSubCategory, setSelectedCategory, setSelectedSubCategory }: CategoryProps) {
    return (
        <>
            {selectedCategory?.id == category.id
                ? (
                    <div>
                        <div className="flex gap-3 items-center cursor-pointer">
                            <div className="font-medium">
                                {category.name}
                            </div>
                            <Image
                                src={'/icons/category-arrow.svg'}
                                alt="Category icon"
                                width={8}
                                height={14}

                                className="min-h-3.5 min-w-2"
                            ></Image>
                        </div>

                        <div className="mt-3 ms-3 flex flex-col gap-1">
                            {category.subcategories.map((subcategory) => {
                                return (
                                    <div key={subcategory.id} className={`${selectedSubCategory?.id == subcategory.id ? 'bg-muted' : ''} py-2 px-6 rounded-full text-sm cursor-pointer`}
                                        onClick={() => {
                                            setSelectedSubCategory(subcategory);
                                        }}
                                    >
                                        {subcategory.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
                : (
                    <div className="flex gap-3 items-center cursor-pointer"
                        onClick={() => {
                            setSelectedCategory(category)
                        }}
                    >
                        <div className="font-medium text-dark-light-gray">
                            {category.name}
                        </div>
                        <Image
                            src={'/icons/category-arrow.svg'}
                            alt="Category icon"
                            width={8}
                            height={14}

                            className="min-h-3.5 min-w-2 rotate-180"
                        ></Image>
                    </div>
                )
            }
        </>
    );
}

export default EditCategory;