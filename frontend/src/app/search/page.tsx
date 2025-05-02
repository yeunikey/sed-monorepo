'use client';

import { ApiResponse, Category, Product, SearchParams } from "@/types";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import CirceLoading from "@/components/loading/CircleLoading";
import Image from "next/image";
import ProductItem from "@/components/product/ProductItem";
import SearchControl from "@/components/pages/search/SearchControl";
import View from "@/components/View";
import { api } from "@/api/instance";
import { useCategories } from "@/hooks/category";
import { useSearch } from "@/hooks/search";

export default function Search() {
    const searchParams = useSearchParams();
    const { category, setCategory, subcategory, setSubCategory, loading, setLoading, minPrice, maxPrice, city, text, setText } = useSearch();

    const router = useRouter()
    const { categories, setCategories } = useCategories();

    const [form, setForm] = useState<SearchParams>({});
    const [results, setResults] = useState<Product[]>([]);

    const searchProducts = async (params: SearchParams) => {
        const res = await api.get('/search', { params });
        return res.data;
    };

    const updateSearchParams = (params: Record<string, string | number | undefined>) => {
        const search = new URLSearchParams(searchParams.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                search.delete(key);
            } else {
                search.set(key, value.toString());
            }
        });

        router.push(`?${search.toString()}`);
    };

    const [fetching, setFetching] = useState(false);

    const handleSearch = async () => {
        if (categories.length === 0) return;
        setLoading(true);
        setFetching(true);
        const data = await searchProducts({
            categoryId: category?.id,
            subcategoryId: subcategory?.id,
            minPrice: minPrice,
            maxPrice: maxPrice,
            city: city == '' ? undefined : city,
            text: text
        });
        setResults(data);
        setLoading(false);
        setFetching(false);
    };

    const fetchCategories = async () => {
        await api.get<ApiResponse<Category[]>>('/categories')
            .then((response) => {
                setCategories(response.data.data)
            });
    }

    useEffect(() => {

        if (categories.length == 0) {
            return;
        }

        if (fetching) {
            return;
        }

        const categoryId = searchParams.get('category_id');
        if (categoryId) {
            const category = categories.find(c => c.id == Number(categoryId));
            setCategory(category ? category : null);
            setForm({
                ...form,
                categoryId: category?.id
            })

            const subcategoryId = searchParams.get('subcategory_id');
            if (subcategoryId) {
                const subcategory = category?.subcategories.find(c => c.id == Number(subcategoryId));
                setSubCategory(subcategory ? subcategory : null);
                setForm({
                    ...form,
                    subcategoryId: subcategory?.id
                })
            } else {
                setSubCategory(null)
                setForm({
                    ...form,
                    subcategoryId: undefined
                })
            }
        }

        const text = searchParams.get('text');
        if (text) {
            setText(text);
        }

        handleSearch()

    }, [categories, searchParams])

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <View className="mt-12 flex flex-col md:flex-row gap-12" container>

            <SearchControl
                categories={categories}
                selectedCategory={category}
                selectedSubCategory={subcategory}
                updateSearchParams={updateSearchParams}
            />

            <div className="w-full">
                <div>
                    <div className="flex flex-row gap-2">
                        <div className="text-dark-light-gray">
                            SED
                        </div>
                        <div className="text-dark font-bold">
                            /
                        </div>
                        <div className="text-dark-light-gray">
                            Категория
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="text-4xl font-bold">
                            {!subcategory ? (!category ? '' : category.name) : subcategory.name}
                        </div>
                        <div className="mt-1 text-dark-light-gray">
                            {`В подборке ${results.length} товаров из категорий`}
                        </div>
                    </div>
                </div>

                <div className="mt-8 h-full">
                    <div className="flex gap-6">
                        <div className="text-dark-light-gray ">
                            Сначала показывать:
                        </div>

                        <div className="flex gap-3 font-semibold cursor-pointer">
                            Новые

                            <Image
                                src={'/icons/category-arrow.svg'}
                                alt="Category icon"
                                width={8}
                                height={14}

                                className="min-h-3.5 min-w-2"
                            ></Image>
                        </div>
                    </div>

                    {loading
                        ? (
                            <div className="mt-32 w-full flex justify-center items-center">
                                <CirceLoading></CirceLoading>
                            </div>
                        )
                        :
                        (
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {results.map((product) => {
                                    return (
                                        <ProductItem key={product.id} product={product} />
                                    )
                                })}
                            </div>
                        )}
                </div>
            </div>

        </View>
    )
}