import View from "@/components/View";
import Image from "next/image";

export default function Messages() {
    return (
        <View className="mt-12 h-full grow" container>

            <div className="flex flex-row gap-2">
                <div className="text-dark-light-gray">
                    SED
                </div>
                <div className="text-dark font-bold">
                    /
                </div>
                <div className="text-dark-light-gray">
                    Сообщения
                </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="md:block w-full md:min-w-60 md:w-60 lg:w-96">
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
                            placeholder="Имя посредника"
                            className="text-dark text-base w-full outline-none placeholder:text-dark-gray"
                        />
                    </div>

                    <div className="mt-6 flex flex-row overflow-x-scroll hidden-scrollbar md:flex-col gap-2">
                        <div className="p-3 min-w-48 md:w-full bg-primary rounded-2xl flex gap-6 cursor-pointer">
                            <div className="bg-muted-dark rounded-full min-w-12 h-12" />

                            <div className="flex flex-col gap-1">
                                <div className="font-semibold text-white">
                                    Ерасыл Унербек
                                </div>
                                <div className="hidden md:flex flex-row gap-2 items-center">
                                    <Image
                                        src="/icons/star.svg"
                                        alt="star icon"
                                        width={14}
                                        height={14}

                                        className="min-h-3.5 min-w-3.5"
                                    ></Image>

                                    <div className="text-white font-bold text-sm">
                                        5,2
                                    </div>
                                </div>
                            </div>
                        </div>
                        {Array.from({ length: 5 }).map((_, i) => {
                            return (
                                <div key={i} className="p-3 min-w-48 md:w-full bg-muted rounded-2xl flex gap-6 cursor-pointer">
                                    <div className="bg-muted-dark rounded-full min-w-12 h-12" />

                                    <div className="flex flex-col gap-1">
                                        <div className="font-semibold text-dark">
                                            Ерасыл Унербек
                                        </div>
                                        <div className="hidden md:flex flex-row gap-2 items-center">
                                            <Image
                                                src="/icons/star.svg"
                                                alt="star icon"
                                                width={14}
                                                height={14}

                                                className="min-h-3.5 min-w-3.5"
                                            ></Image>

                                            <div className="text-dark font-bold text-sm">
                                                5,2
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="w-full flex flex-col">
                    <div className="p-3 bg-muted rounded-2xl flex gap-6 cursor-pointer">
                        <div className="bg-muted-dark rounded-full w-12 h-12" />

                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-dark">
                                Ерасыл Унербек
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Image
                                    src="/icons/star.svg"
                                    alt="star icon"
                                    width={14}
                                    height={14}

                                    className="min-h-3.5 min-w-3.5"
                                ></Image>

                                <div className="text-dark font-bold text-sm">
                                    5,2
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 w-full min-h-[400px] h-full bg-muted rounded-2xl p-3 flex flex-col items-end">

                        <div className="w-full h-full flex flex-col gap-1 justify-end grow">
                            <div className="w-full flex justify-start">
                                <div className="py-3 px-6 bg-dark-light-gray text-white rounded-2xl rounded-ss-none">
                                    Привет, это сообщение от продавца
                                </div>
                            </div>
                            <div className="w-full flex justify-start">
                                <div className="py-3 px-6 bg-dark-light-gray text-white rounded-2xl">
                                    и ещё одно сообщение...
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <div className="py-3 px-6 bg-primary text-white rounded-2xl rounded-se-none">
                                    Привет, это сообщение от меня
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 w-full flex bg-white rounded-2xl py-3 px-6 gap-6 items-center">
                            <Image
                                src="/icons/messages.svg"
                                alt="messages icon"
                                width={16}
                                height={16}
                                className="h-4 w-auto"
                            />

                            <input
                                type="text"
                                placeholder="Напишите сообщение..."
                                className="text-dark text-base w-full outline-none placeholder:text-dark-gray"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </View>
    )
}