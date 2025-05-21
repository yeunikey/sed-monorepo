import CirceLoading from "@/components/loading/CircleLoading";
import Image from "next/image";
import Link from "next/link";
import ProfileProducts from "./ProfileProducts";
import { User } from "@/types";
import { useRouter } from "next/navigation";

interface ProfileProps {
    pageUser: User | null
    isLoading: boolean,
    error: boolean
}

function ProfileInfo({ pageUser, isLoading, error }: ProfileProps) {
    const router = useRouter();

    if (isLoading) {
        return <CirceLoading className="w-full grow flex justify-center items-center"></CirceLoading>
    }

    if (error) {
        return (
            <div className="w-full grow flex flex-col justify-center items-center">
                <div className="test">
                    <div className="text-3xl font-semibold">
                        Такого пользователя <br />не существует :(
                    </div>
                    <div className="mt-4 text-xl">
                        Увы, но вам придётся вернуться <br />в главную страницу
                    </div>
                    <div className="mt-6 px-8 py-2 bg-dark rounded-2xl text-white w-fit font-medium cursor-pointer"
                        onClick={() => {
                            router.push('/')
                        }}
                    >
                        Домой
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col md:flex-row gap-12">
            <div className="min-w-96 flex flex-col gap-12">
                <div className="flex flex-col gap-3">
                    <div className="relative bg-primary rounded-2xl w-full h-32 flex justify-center" />

                    <div className="flex justify-center -mt-12 z-10">
                        <img
                            src={"https://api.sedmarket.kz/v1/images/" + pageUser?.image}
                            className="w-20 h-20 bg-muted-dark rounded-full object-cover outline-6 outline-white"
                        >
                        </img>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="text-2xl font-semibold">
                            {pageUser?.name + " " + pageUser?.surname}
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                src="/icons/star.svg"
                                alt="star icon"
                                width={17}
                                height={16}

                                className="min-h-4 min-w-4"
                            ></Image>

                            <div className="text-dark font-bold">
                                {pageUser?.rating.toFixed(1)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="font-semibold text-xl flex justify-center">
                        Подробная информация
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2">
                            <div>
                                Город
                            </div>
                            <div className="font-semibold">
                                {pageUser?.city}
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div>
                                Телефон
                            </div>
                            <div className="font-semibold">
                                {pageUser?.phone}
                            </div>
                        </div>
                        {pageUser?.shopinfo && (
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-2">
                                    <div>
                                        Название
                                    </div>
                                    <div className="font-semibold">
                                        {pageUser?.shopinfo.name}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <div>
                                        Адрес
                                    </div>
                                    <div className="font-semibold">
                                        {pageUser?.shopinfo.address}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link href="/profile" className="w-fit bg-dark rounded-2xl px-6 py-2 flex gap-2.5 items-center cursor-pointer">
                        <Image
                            src={'/icons/home-light.svg'}
                            alt="home icon"
                            width={16}
                            height={16}

                            className="min-h-4 min-w-4"
                        ></Image>

                        <div className="text-base text-white">
                            Связаться
                        </div>
                    </Link>
                </div>
            </div>

            <ProfileProducts pageUser={pageUser} error={error} isLoading={isLoading}></ProfileProducts>
        </div>
    );
}

export default ProfileInfo;