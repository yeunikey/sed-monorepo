import { useCategories } from "@/hooks/category";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';

function CategoriesDropdown() {
    const { categories } = useCategories();

    return (
        <div className="absolute z-[100] top-full left-0 w-full bg-muted p-6 md:px-12 pt-6 pb-6 min-h-48 border-b-1 border-muted-dark">
            <Swiper
                slidesPerView={'auto'}
                spaceBetween={24}
                className=""
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.id} style={{ width: 'auto' }}>
                        <div
                            className="bg-white rounded-2xl min-w-64 md:min-w-72 max-w-3xl w-fit p-6 overflow-y-auto flex-shrink-0"
                        >
                            <Link href={`/search?category_id=${category.id}`} className="text-2xl font-semibold cursor-pointer">
                                {category.name}
                            </Link>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {category.subcategories.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={`/search?category_id=${category.id}&subcategory_id=${sub.id}`}
                                        className="py-1 px-3 font-medium rounded-full cursor-pointer bg-muted hover:bg-dark/10 whitespace-nowrap"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>

    );
}

export default CategoriesDropdown;