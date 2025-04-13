import Image from "next/image";
import Link from "next/link";

function Header() {
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
                    ></Image>
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
                        type="text"
                        placeholder="Поиск по названию товара и категории..."
                        className="text-dark text-base w-full outline-none placeholder:text-dark-gray"
                    />
                </div>

            </section>

            <section className="flex gap-6">
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

                <Link href="/profile" className="bg-dark rounded-full py-2 px-8 flex justify-center items-center text-white text-base cursor-pointer hover:opacity-95 hover:scale-105">
                    Войти
                </Link>
            </section>

        </header>
    );
}

export default Header;