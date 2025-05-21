import View from "@/components/View";
import Image from "next/image";
import Link from "next/link";

export default function Error() {
    return (
        <View className="mx-12 flex grow items-center justify-center">

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2.5">
                    <div className="text-4xl font-semibold text-dark">
                        Упс... Кажется такой <br />
                        страницы не существует
                    </div>
                    <div className="text-dark-light-gray font-medium text-lg">
                        Воспользуйтесь кнопкой ниже, <br />
                        чтобы перейти домой
                    </div>
                </div>
                <Link href="/" className="w-fit bg-dark rounded-full px-6 py-2 flex gap-2.5 items-center cursor-pointer">
                    <Image
                        src={'/icons/home.svg'}
                        alt="home icon"
                        width={16}
                        height={16}

                        className="min-h-4 min-w-4"
                    ></Image>

                    <div className="text-base text-white">
                        Домой
                    </div>
                </Link>
            </div>

        </View >
    )
}