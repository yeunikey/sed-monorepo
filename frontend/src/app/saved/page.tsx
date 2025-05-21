'use client'

import { ApiResponse, Category, Product, SubCategory } from "@/types";
import { useEffect, useState } from "react";

import CirceLoading from "@/components/loading/CircleLoading";
import ProductItem from "@/components/product/ProductItem";
import SavedCategory from "@/components/pages/saved/SavedCategories";
import View from "@/components/View";
import { api } from "@/api/instance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";
import { useCategories } from "@/hooks/category";

export default function Saved() {
    const { token } = useAuth();
    const { categories } = useCategories();

    const [loading, setLoading] = useState(true);

    const [products, setProducts] = useState<Product[]>([]);
    const [display, setDisplay] = useState<Product[]>([]);

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

    const fetchProducts = async () => {

        await api.get<ApiResponse<Product[]>>('/users/saved-products', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(({ data }) => {

                if (data.statusCode != 200) {
                    toast.error(data.message);
                    return;
                }

                setProducts(data.data)
                setDisplay(data.data);
            }).finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {

        if (selectedCategory == null && selectedSubCategory == null) {
            setDisplay(products);
            return;
        }

        if (selectedSubCategory != null) {
            setDisplay(products.filter(p => p.subCategory.id == selectedSubCategory.id))
            return;
        }

        if (selectedCategory != null) {
            setDisplay(products.filter(p => p.category.id == selectedCategory.id));
        }

    }, [selectedCategory, selectedSubCategory])

    useEffect(() => {

        if (token === '') {
            return;
        }

        fetchProducts()
    }, [token])

    return (
        <View className="mt-12 grow flex flex-col" container>

            <div className="flex flex-row gap-2">
                <div className="text-dark-light-gray">
                    SED
                </div>
                <div className="text-dark font-bold">
                    /
                </div>
                <div className="text-dark-light-gray">
                    Сохранённые товары
                </div>
            </div>

            <div className="flex gap-12 mt-6">
                <div className="min-w-72">
                    <div className="font-semibold text-xl">
                        По категории
                    </div>

                    <div className="mt-3 flex flex-col gap-3">

                        {categories.map((category) => {
                            return (<SavedCategory key={category.id} category={category} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} setSelectedCategory={setSelectedCategory} setSelectedSubCategory={setSelectedSubCategory} />)
                        })}

                    </div>
                </div>

                <section className="flex flex-col gap-3 grow">
                    <div className="w-full flex justify-between items-end">
                        <div className="text-3xl font-semibold">
                            Сохранённые <br className="sm:hidden"></br>товары
                        </div>
                        <div className="text-dark-light-gray">
                            {display.length + ' товаров'}
                        </div>
                    </div>

                    {loading
                        ? (
                            <CirceLoading className="grow flex items-center justify-center" />
                        )
                        : (
                            <>
                                {display.length == 0
                                    ? (
                                        <div className="mt-32 text-dark-light-gray font-medium text-lg flex justify-center">
                                            У вас нет сохранённых продуктов
                                        </div>
                                    )
                                    : (
                                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                            {display.map((product) => {
                                                return <ProductItem key={product.id} product={product}></ProductItem>
                                            })}
                                        </div>
                                    )}
                            </>
                        )
                    }
                </section >
            </div>

        </View >
    )
}