import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

function ProductItem({ product }: { product: Product }) {

    const [viewImage, setViewImage] = useState<string>(product.banner);

    useEffect(() => {
        const allImages = [product.banner, ...product.images];
        allImages.forEach((img) => {
            const preloadImg = new window.Image(); // <- вот тут добавь window
            preloadImg.src = 'https://api.sedmarket.kz/v1/images/' + img;
        });
    }, [product]);


    return (
        <Link href={"/item/" + product.id} className="flex flex-col gap-5 h-full">
            <div className="relative w-full aspect-square bg-muted rounded-2xl overflow-hidden">
                <img
                    className="w-full h-full object-contain"
                    src={'https://api.sedmarket.kz/v1/images/' + viewImage}
                />
                <div
                    className="absolute w-full h-full bottom-0 px-6 flex flex-row"
                    onPointerOut={() => setViewImage(product.banner)}
                >
                    {product.images.map((image, i) => (
                        <div
                            key={i}
                            className="group w-full h-full flex items-end"
                            onPointerEnter={() => setViewImage(image)}
                        >
                            <div className="bottom-0 mx-1 bg-muted-dark group-hover:bg-dark/50 min-h-1 w-full rounded-ss-2xl rounded-se-2xl" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Контейнер, растягивающийся по высоте */}
            <div className="flex flex-col justify-between flex-1 gap-3">
                {/* Название и категория */}
                <div className="flex flex-col gap-1">
                    <div className="text-dark text-lg font-semibold line-clamp-2">
                        {product.title}
                    </div>
                    <div className="text-dark-light-gray font-semibold">
                        {product.subCategory.name}
                    </div>
                </div>

                {/* Цены и лайк — прижаты к низу */}
                <div className="flex flex-row justify-between items-end">
                    <div className="text-dark font-bold text-2xl text-nowrap">
                        {Math.floor(product.price) + ' ₸'}
                    </div>

                    <div className="flex flex-row gap-3">
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                src="/icons/star.svg"
                                alt="star icon"
                                width={17}
                                height={16}
                                className="min-h-4 min-w-4"
                            />
                            <div className="text-dark font-bold">
                                {product.rating.toFixed(1)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>

    )
}

export default ProductItem;