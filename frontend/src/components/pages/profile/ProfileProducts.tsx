import { ApiResponse, Product, User } from "@/types";
import { useEffect, useState } from "react";

import CirceLoading from "@/components/loading/CircleLoading";
import Link from "next/link";
import ProductItem from "@/components/product/ProductItem";
import { api } from "@/api/instance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";

interface ProfileProps {
    pageUser: User | null
    isLoading: boolean,
    error: boolean
}

function ProfileProducts({ pageUser }: ProfileProps) {
    const { user } = useAuth();

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div className="text-2xl font-semibold">
                    {"Товары " + pageUser?.name + " " + pageUser?.surname[0]}.
                </div>
                {pageUser?.id == user?.id && (
                    <Link href={'/item/create'} className="py-2 px-6 rounded-2xl bg-dark text-white flex gap-2 items-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                        <div className="hidden sm:block">
                            Новый товар
                        </div>
                    </Link>
                )}
            </div>

            <Products pageUser={pageUser}></Products>
        </div>
    );
}

function Products({ pageUser }: { pageUser: User | null }) {

    const [isLoading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {

        await api.get<ApiResponse<Product[]>>('/products/user/' + pageUser?.id)
            .then((({ data: response }) => {

                if (response.statusCode != 200) {
                    toast(response.message, {
                        type: "error"
                    })
                    return;
                }

                setProducts(response.data)
                setLoading(false);

            })).catch(() => {
                toast("Пропала связь с сервером", {
                    type: "error"
                })
            })
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    if (isLoading) {
        return <CirceLoading className="w-full h-full flex justify-center items-center"></CirceLoading>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product, i) => {
                return (
                    <ProductItem key={i} product={product}></ProductItem>
                )
            })}
        </div >
    )
}

export default ProfileProducts;