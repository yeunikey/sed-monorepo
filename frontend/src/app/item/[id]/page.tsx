'use client';

import 'swiper/css';

import { ApiResponse, Product } from "@/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";

import CirceLoading from "@/components/loading/CircleLoading";
import Image from "next/image";
import Link from "next/link";
import ProductItem from "@/components/product/ProductItem";
import View from "@/components/View";
import { api } from "@/api/instance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";
import { useParams } from "next/navigation";

export default function Item() {
    const params = useParams();
    const { token, user } = useAuth();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);

    const [viewImage, setViewImage] = useState(0);
    const [saved, setSaved] = useState(false);

    const [selectedStars, setSelectedStars] = useState(0);
    const [hoveredStars, setHoveredStars] = useState(0);

    const [userRating, setUserRating] = useState<number | null>(null); // оценка, которую пользователь поставил

    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        await api.get<ApiResponse<Product[]>>('/products/')
            .then((response) => {
                setProducts(response.data.data);
            })
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchUserRating = async () => {
        setFetching(true);
        if (!product || !token) return;

        try {
            const { data: response } = await api.get<ApiResponse<{ stars: number }>>(
                '/reviews/get',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        product_id: product.id
                    }
                }
            );

            if (response.statusCode === 200 && response.data.stars != null) {
                setUserRating(response.data.stars);
                setSelectedStars(response.data.stars);
            }

        } catch {
            toast.error("Не удалось получить вашу оценку");
        }

        setFetching(false);
    };

    const handleStarClick = (index: number) => {

        if (fetching) {
            return;
        }

        setSelectedStars(index);
        saveOrUpdateRating(index);
    };

    const saveOrUpdateRating = async (stars: number) => {
        if (!token || !product || fetching) return;

        try {
            const endpoint = userRating ? '/reviews/update' : '/reviews/create';

            const { data: response } = await api.post(
                endpoint,
                {
                    product: product,
                    stars: stars,
                    seller: product.user,
                    reviewer: user
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.statusCode === 200) {
                setUserRating(stars);
            } else {
                toast.error(response.message);
            }
        } catch {
            toast.error('Ошибка при сохранении оценки');
        }
    };

    useEffect(() => {
        if (token && product) {
            fetchUserRating();
        }
    }, [token, product]);

    const isSaved = async () => {
        await api.post<ApiResponse<{ saved: boolean }>>('/users/is-saved-product', {
            productId: product?.id
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(({ data: response }) => {

                if (response.statusCode != 200) {
                    toast.error(response.message);
                    return;
                }

                setFetching(false);
                setSaved(response.data.saved);
            })
    }

    const saveProduct = async () => {
        setSaved(true);
        await api.post('/users/save-product', {
            productId: product?.id
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(({ data: response }) => {

                if (response.statusCode != 200) {
                    toast.error(response.message);
                    return;
                }

                setFetching(false);
            })
    }

    const removeProduct = async () => {
        setSaved(false);
        await api.post('/users/remove-saved-product', {
            productId: product?.id
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(({ data: response }) => {

                if (response.statusCode != 200) {
                    toast.error(response.message);
                    return;
                }

                setFetching(false);
            })
    }

    const toggleSaveProduct = async () => {

        if (fetching || token == '') {
            return;
        }

        setFetching(true);
        if (saved) {
            await removeProduct();
        } else {
            await saveProduct();
        }
    }

    const fetchProduct = async () => {
        await api.get<ApiResponse<Product>>('/products/id/' + params.id)
            .then(({ data: response }) => {

                if (response.statusCode != 200) {
                    toast.error(response.message)
                    return;
                }

                setProduct(response.data);
                setLoading(false);

            })
    }

    useEffect(() => {
        fetchProduct();
    }, [])

    useEffect(() => {

        if (token == '' || !product) {
            return;
        }

        isSaved();

    }, [token, product])

    if (isLoading) {
        return (
            <View className="grow flex justify-center items-center" container>
                <CirceLoading></CirceLoading>
            </View>
        )
    }

    if (!product) {
        return (
            <View className="!mx-48 mt-12 flex flex-col gap-12" container>
                <CirceLoading className="w-full h-full flex justify-center items-center"></CirceLoading>
            </View>
        )
    }

    return (
        <View className="xl:!mx-48 mt-12 flex flex-col gap-12" container>

            <div className="flex flex-col gap-6">
                <div className="flex flex-row gap-2">
                    <div className="text-dark-light-gray">
                        SED
                    </div>
                    <div className="text-dark font-bold">
                        /
                    </div>
                    <div className="text-dark-light-gray">
                        {product.category.name}
                    </div>
                    <div className="text-dark font-bold">
                        /
                    </div>
                    <div className="text-dark-light-gray">
                        {product.subCategory.name}
                    </div>
                    <div className="text-dark font-bold">
                        /
                    </div>
                    <div className="text-dark-light-gray">
                        {product.title}
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-24">
                    <div className="w-full md:w-96 xl:w-2xl flex flex-col gap-6">
                        <img src={'https://api.sedmarket.kz/v1/images/' + product.images[viewImage]} className="w-full aspect-square bg-muted rounded-2xl object-contain" />

                        <Swiper
                            spaceBetween={10}
                            slidesPerView={"auto"}
                            className="w-full h-full"
                        >
                            {product.images.map((image, i) => {
                                return (
                                    <SwiperSlide key={i} style={{ width: 'auto' }}>
                                        <img src={'https://api.sedmarket.kz/v1/images/' + image} className="w-24 md:min-w-20 md:w-24 xl:min-w-36 aspect-square bg-muted rounded-2xl cursor-pointer hover:border-2 hover:border-dark object-cover"
                                            onClick={() => {
                                                setViewImage(i)
                                            }}
                                        />
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>

                    <div className="flex flex-col gap-6 grow">
                        <div className="flex flex-col gap-2">
                            <div className="text-dark font-semibold text-4xl">
                                {product.title}
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-dark-light-gray font-medium text-xl">
                                    {product.subCategory.name}
                                </div>
                                <div className="bg-dark-gray rounded-full text-white py-1 px-3">
                                    {product.city}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="font-medium">
                                    Продавец
                                </div>

                                <Link href={'/profile/' + product.user.id} className="flex flex-row gap-3 items-center cursor-pointer">
                                    <img src={'https://api.sedmarket.kz/v1/images/' + product.user.image} className="bg-dark-light-gray rounded-full h-8 w-8 object-cover" />

                                    <div className="font-medium">
                                        {product.user.name + " " + product.user.surname[0] + '.'}
                                    </div>
                                </Link>
                            </div>

                            <div className="bg-muted rounded-2xl p-6">
                                <div className="font-medium">
                                    Стоимость
                                </div>

                                <div className="flex justify-between items-center gap-2">
                                    <div className="text-4xl font-bold text-dark">
                                        {Math.floor(product.price) + ' ₸'}
                                    </div>

                                    <div className="flex flex-row gap-3 items-center">
                                        <Image
                                            src="/icons/star.svg"
                                            alt="star icon"
                                            width={17}
                                            height={16}

                                            className="min-h-8 min-w-8"
                                        ></Image>

                                        <div className="text-dark font-bold text-2xl">
                                            {Math.round(product.rating)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row flex-nowrap gap-4">
                                <Link href="/messages" className="w-full bg-primary rounded-2xl py-4 flex gap-4 items-center justify-center cursor-pointer">
                                    <Image
                                        src={'/icons/messages-light.svg'}
                                        alt="heart icon"
                                        width={16}
                                        height={16}

                                        className="min-h-6 min-w-6"
                                    ></Image>

                                    <div className="text-xl text-white">
                                        Связаться
                                    </div>
                                </Link>
                                <div className="w-full bg-dark rounded-2xl py-4 flex gap-4 items-center justify-center cursor-pointer"
                                    onClick={toggleSaveProduct}
                                >
                                    {saved
                                        ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" /></svg>
                                        )
                                        : (
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" /></svg>
                                        )}
                                    <div className="text-xl text-white">
                                        {saved ? "Сохранено" : "В избранное"}
                                    </div>
                                </div>
                            </div>

                            {(user && user.id == product.user.id) && (
                                <Link href={'/item/edit/' + product.id} className="w-full bg-dark-light-gray rounded-2xl py-4 flex gap-4 items-center justify-center cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" /></svg>

                                    <div className="text-xl text-white">
                                        Редактирование
                                    </div>
                                </Link>
                            )}
                        </div>
                        <div className="flex flex-col gap-6">

                            <div className="flex flex-col justify-center items-center">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            onClick={() => handleStarClick(star)}
                                            onMouseEnter={() => setHoveredStars(star)}
                                            onMouseLeave={() => setHoveredStars(0)}
                                            className="cursor-pointer transition"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill={(hoveredStars || selectedStars) >= star ? '#FFD700' : '#e3e3e3'}
                                        >
                                            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.851 1.42 8.283L12 18.896l-7.42 4.986L6 15.599 0 9.748l8.332-1.73z" />
                                        </svg>
                                    ))}
                                </div>

                                <div className="font-medium text-dark-light-gray mt-2">
                                    {selectedStars > 0
                                        ? `Вы поставили ${selectedStars} ${selectedStars === 1 ? 'звезду' : 'звезды'}`
                                        : 'Оцените, кликнув на звезды'}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2 text-lg">
                                    <div>
                                        Тип доставки
                                    </div>
                                    <div className="font-semibold">
                                        {product.delivery}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 text-lg">
                                    <div>
                                        Минимальное количество для доставки
                                    </div>
                                    <div className="font-semibold">
                                        {product.minCount + ' шт.'}
                                    </div>
                                </div>
                                {product.variables && product.variables.length > 0 && (
                                    <>
                                        {
                                            product.variables.map((variable) => {
                                                return (
                                                    <div key={variable.id} className="grid grid-cols-2 text-lg">
                                                        <div>
                                                            {variable.name}
                                                        </div>
                                                        <div className="font-semibold">
                                                            {variable.value}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="text-2xl font-semibold">
                    Описание
                </div>

                <div className="whitespace-pre-line h-96 overflow-y-scroll hidden-scrollbar">
                    {product.description}
                </div>
            </div>

            <section className="mt-6 flex flex-col gap-3">
                <div className="text-3xl font-semibold">
                    Рекомендуем вам
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                    {products.map((product, i) => {
                        return <ProductItem key={i} product={product}></ProductItem>
                    })}
                </div>
            </section>

        </View>
    )
}