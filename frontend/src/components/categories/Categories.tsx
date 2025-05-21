'use client';

import { ApiResponse, Category } from "@/types";
import { useEffect, useRef, useState } from "react";

import CategoriesDropdown from "./CategoriesDropdown";
import CategoryItem from "./CategoryItem";
import Image from "next/image";
import { api } from "@/api/instance";
import { useCategories } from "@/hooks/category";
import { useSearchParams } from "next/navigation";

function Categories() {
    const searchParams = useSearchParams();

    const scrollRef = useRef<HTMLDivElement>(null);
    const { categories, setCategories } = useCategories();

    const [dropdown, setDropdown] = useState(false);

    const fetchCategories = async () => {
        await api.get<ApiResponse<Category[]>>('/categories')
            .then((response) => {
                setCategories(response.data.data)
            })
    }

    useEffect(() => {
        fetchCategories();

        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (event: WheelEvent) => {
            if (event.deltaY !== 0) {
                event.preventDefault();
                el.scrollLeft += event.deltaY; // Перенаправляем вертикальный скролл в горизонтальный
            }
        };

        el.addEventListener("wheel", handleWheel);
        return () => el.removeEventListener("wheel", handleWheel);
    }, []);

    return (
        <div className="sticky top-0 z-50 bg-muted px-6 md:px-12 flex gap-6 md:gap-12">

            {dropdown && (<CategoriesDropdown></CategoriesDropdown>)}

            <section className="flex items-center">
                <button className="bg-dark rounded-full px-6 py-2 flex gap-2.5 items-center cursor-pointer"
                    onClick={() => {
                        setDropdown(!dropdown)
                    }}
                >
                    <Image
                        src={'/icons/folders.svg'}
                        alt="folders icon"
                        width={16}
                        height={16}

                        className="min-h-4 min-w-4"
                    ></Image>

                    <div className="hidden md:block text-base text-white">
                        Каталог
                    </div>
                </button>
            </section>

            <section ref={scrollRef} className="flex gap-6 overflow-x-scroll hidden-scrollbar">

                {categories.map((category) => {
                    const category_id = searchParams.get('category_id');
                    return <CategoryItem key={category.id} isActive={category_id ? Number(category_id) == category.id : false} category={category}></CategoryItem>
                })}

            </section>

        </div>
    );
}

export default Categories;