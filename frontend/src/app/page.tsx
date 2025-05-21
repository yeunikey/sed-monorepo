'use client'

import { api } from "@/api/instance";
import ProductItem from "@/components/product/ProductItem";
import View from "@/components/View";
import { ApiResponse, Product } from "@/types";
import Image from "next/image";
import { useState, useEffect } from "react";

import 'swiper/css'
import 'swiper/css/navigation'

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlider, setSlider] = useState(1);

  const fetchProducts = async () => {
    await api.get<ApiResponse<Product[]>>('/products/')
      .then((response) => {
        setProducts(response.data.data);
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <View container>

      <section className="mt-6 bg-[#86A372] rounded-2xl h-60 flex justify-center items-center overflow-hidden">

        <div className="text-white/25 font-bold text-5xl md:text-8xl">
          {'СЛАЙДЕР #' + currentSlider}
        </div>

        <div className="absolute left-10 h-9 w-9 bg-dark rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => {
            if (currentSlider == 1) {
              return;
            }

            setSlider(currentSlider - 1);
          }}
        >
          <Image
            src={'/icons/arrow.svg'}
            alt="arrow icon"
            width={8}
            height={14}

            className="h-3.5 w-auto"
          ></Image>
        </div>

        <div className="absolute right-10 rotate-180 h-9 w-9 bg-dark rounded-full flex justify-center items-center cursor-pointer"
          onClick={() => {
            if (currentSlider == 3) {
              return;
            }

            setSlider(currentSlider + 1);
          }}
        >
          <Image
            src={'/icons/arrow.svg'}
            alt="arrow icon"
            width={8}
            height={14}

            className="h-3.5 w-auto"
          ></Image>
        </div>

      </section>

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
  );
}