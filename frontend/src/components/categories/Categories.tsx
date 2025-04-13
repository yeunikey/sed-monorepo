'use client'

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";

function Categories() {

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

            <section className="flex items-center">
                <button className="bg-dark rounded-full px-6 py-2 flex gap-2.5 items-center cursor-pointer">
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

                <Link href="/category" className="relative text-dark py-3 cursor-pointer ">
                    Электроника
                    <div className="absolute bg-dark bottom-0 h-0.5 w-full" />
                </Link>
                <Link href="/category" className="text-dark py-3 text-nowrap cursor-pointer opacity-50 hover:opacity-100">
                    Бытовая техника
                </Link>
                <Link href="/category" className="text-dark py-3 text-nowrap cursor-pointer opacity-50 hover:opacity-100">
                    Одежда
                </Link>
                <Link href="/category" className="text-dark py-3 text-nowrap cursor-pointer opacity-50 hover:opacity-100">
                    Обувь
                </Link>
                <Link href="/category" className="text-dark py-3 text-nowrap cursor-pointer opacity-50 hover:opacity-100">
                    Аксессуары
                </Link>
                <Link href="/category" className="text-dark py-3 text-nowrap cursor-pointer opacity-50 hover:opacity-100">
                    Красота и уход
                </Link>
                <Link href="/category" className="text-dark py-3 text-nowrap cursor-pointer opacity-50 hover:opacity-100">
                    Здоровье
                </Link>
                <Link href="/category" className="text-dark py-3 text-nowrap cursor-pointer opacity-50 hover:opacity-100">
                    Товары для дома
                </Link>

            </section>

        </div>
    );
}

export default Categories;