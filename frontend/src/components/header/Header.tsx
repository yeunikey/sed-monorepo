'use client'

import { useRouter, useSearchParams } from "next/navigation";

import Cookies from 'js-cookie';
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { useSearch } from "@/hooks/search";
import { useState } from "react";

function Header() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const { text, setText } = useSearch();

    const searchParams = useSearchParams();
    const router = useRouter();

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

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            updateSearchParams({ text: text });
        }
    };

    return (
        <header className="w-full py-6 px-6 md:px-12 flex gap-16 **:transition-all **:duration-300">
            <section className="flex grow gap-8 items-center">
                <Link href="/">
                    <Image
                        src={'/logo.svg'}
                        alt="SED icon"
                        width={97}
                        height={24}
                        className="h-6 w-auto cursor-pointer"
                    />
                </Link>

                <div className="w-full hidden sm:flex bg-muted rounded-2xl py-3 px-6 gap-6 items-center">
                    <Image
                        src="/icons/search.svg"
                        alt="search icon"
                        width={16}
                        height={16}
                        className="h-4 w-auto"
                    />
                    <input
                        type="search"
                        name="search"
                        autoComplete="off"
                        id="search"
                        placeholder="Поиск по названию товара и категории..."
                        className="text-dark text-base w-full outline-none placeholder:text-dark-gray"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </section>

            <section className="flex gap-6 items-center">
                <div className="hidden sm:flex gap-1">
                    <Link href="/saved" className="p-3 cursor-pointer rounded-full hover:bg-muted hover:scale-105">
                        <Image
                            src={'/icons/heart.svg'}
                            alt="heart icon"
                            width={24}
                            height={24}

                            className="min-h-6 min-w-6"
                        ></Image>
                    </Link>

                    <Link href="/messages" className="p-3 cursor-pointer rounded-full hover:bg-muted hover:scale-105">
                        <Image
                            src={'/icons/messages.svg'}
                            alt="messages icon"
                            width={24}
                            height={24}

                            className="min-h-6 min-w-6"
                        ></Image>
                    </Link>
                </div>

                {user == null
                    ? (
                        <Link href="/auth" className="bg-dark rounded-full py-2 px-8 flex justify-center items-center text-white text-base cursor-pointer hover:opacity-95 hover:scale-105">
                            Войти
                        </Link>
                    )
                    : (
                        <div className="relative">
                            {
                                user.image
                                    ? (
                                        <img
                                            src={"https://api.sedmarket.kz/v1/images/" + user.image}
                                            className="w-12 h-12 bg-muted-dark/50 rounded-full object-cover"
                                            onClick={() => {
                                                setOpen(!open);
                                            }}
                                        >
                                        </img>

                                    )
                                    : (
                                        <div
                                            className="w-12 h-12 bg-muted-dark/50 rounded-full flex items-center justify-center text-dark-light-gray font-semibold cursor-pointer"
                                            onClick={() => {
                                                setOpen(!open);
                                            }}
                                        >
                                            {user?.name[0] + user?.surname[0]}
                                        </div>
                                    )
                            }

                            {open && <Dropdown />}
                        </div>
                    )}
            </section>

        </header>
    );
}

function Dropdown() {
    const { user } = useAuth();

    if (!user) {
        return <></>
    }

    const handleLogout = () => {
        Cookies.remove('token');
        window.location.reload();
    }

    return (
        <div className="absolute z-60 top-16 right-0 p-3 w-64 bg-white border-muted-dark border-1 rounded-2xl">
            <div className="test">
                <div className="text-lg font-semibold">
                    {user?.name + ' ' + user?.surname}
                </div>
                <div className="test">
                    ID: {user.id}
                </div>
            </div>

            <div className="flex flex-col">
                <Link className="mt-4 py-2 w-full ps-6 bg-muted rounded-xl hover:bg-muted-dark/50 cursor-pointer"
                    href={'/profile/' + user.id}
                >
                    Профиль
                </Link>
                <Link className="mt-1 py-2 w-full ps-6 bg-muted rounded-xl hover:bg-muted-dark/50 cursor-pointer"
                    href={'/messages'}
                >
                    Сообщения
                </Link>
                <Link className="mt-1 py-2 w-full ps-6 bg-muted rounded-xl hover:bg-muted-dark/50 cursor-pointer"
                    href={'/saved'}
                >
                    Избранное
                </Link>
                <Link className="mt-1 py-2 w-full ps-6 bg-muted rounded-xl hover:bg-muted-dark/50 cursor-pointer"
                    href={'/settings'}
                >
                    Настройки
                </Link>
                {user.role == "ADMIN" && (
                    <Link className="mt-1 py-2 w-full ps-6 bg-muted rounded-xl hover:bg-muted-dark/50 cursor-pointer"
                        href={'/admin'}
                    >
                        Администрирование
                    </Link>
                )}
            </div>

            <div className="bg-muted h-0.5 w-full my-4" />

            <div className="py-2 w-full flex justify-center border-red-500 border-2 text-red-500 rounded-xl hover:bg-red-600 hover:text-white font-medium cursor-pointer"
                onClick={handleLogout}
            >
                Выйти
            </div>
        </div>
    )
}

export default Header;