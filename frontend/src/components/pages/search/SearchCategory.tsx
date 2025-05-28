'use client'

import { Category, SubCategory } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import { useSearch } from "@/hooks/search";

interface CategoryProps {
    category: Category,
    selectedCategory: Category | null,
    selectedSubCategory: SubCategory | null
}

function SearchCategory({ category, selectedCategory, selectedSubCategory }: CategoryProps) {
    const { setCategory, setSubCategory, subcategory: sub, loading } = useSearch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateSearchParams = (params: Record<string, string | number | undefined>) => {
        const search = new URLSearchParams(searchParams.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                search.delete(key);
            } else {
                search.set(key, value.toString());
            }
        });

        router.push(`/search?${search.toString()}`);
    };

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

                                            if (loading) {
                                                return;
                                            }

                                            setSubCategory(sub?.id == subcategory.id ? null : subcategory);

                                            if (selectedSubCategory?.id == subcategory.id) {
                                                updateSearchParams({
                                                    category_id: selectedCategory.id,
                                                    subcategory_id: undefined
                                                })
                                            } else {
                                                updateSearchParams({
                                                    category_id: selectedCategory.id,
                                                    subcategory_id: subcategory.id
                                                })
                                            }
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

                            if (loading) {
                                return;
                            }

                            router.push("/search?category_id=" + category.id);
                            setCategory(category)
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

export default SearchCategory;