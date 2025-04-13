import Image from "next/image";
import Container from "../Container";
import Link from "next/link";

function Footer() {
    return (
        <div className="mt-24 flex flex-col gap-6">

            <Container className="overflow-hidden">
                <div className="h-48 bg-[#728CA3] rounded-2xl flex justify-center items-center
                    text-white/25 text-4xl md:text-7xl font-bold p-16 text-center">
                    Баннер с рекламой соц. сетей
                </div>
            </Container>

            <footer className="bg-muted py-6">
                <Container className="flex flex-col gap-6">
                    <div className="w-full flex justify-between items-center">
                        <Link href="/">
                            <Image
                                src={'/logo.svg'}
                                alt="SED icon"
                                width={97}
                                height={24}

                                className="h-6 w-auto cursor-pointer"
                            ></Image>
                        </Link>

                        <div className="flex flex-row gap-3">
                            <a href="#">
                                <Image
                                    src={'/icons/twitter.svg'}
                                    alt="twitter icon"
                                    width={97}
                                    height={24}

                                    className="min-h-5 w-auto cursor-pointer"
                                ></Image>
                            </a>
                            <a href="#">
                                <Image
                                    src={'/icons/facebook.svg'}
                                    alt="facebook icon"
                                    width={97}
                                    height={24}

                                    className="min-h-5 w-auto cursor-pointer"
                                ></Image>
                            </a>
                            <a href="#">
                                <Image
                                    src={'/icons/instagram.svg'}
                                    alt="instagram icon"
                                    width={97}
                                    height={24}

                                    className="min-h-5 w-auto cursor-pointer"
                                ></Image>
                            </a>
                            <a href="#">
                                <Image
                                    src={'/icons/youtube.svg'}
                                    alt="youtube icon"
                                    width={97}
                                    height={24}

                                    className="min-h-5 w-auto cursor-pointer"
                                ></Image>
                            </a>
                        </div>
                    </div>

                    <div className="h-0.5 w-full bg-muted-dark"></div>

                    <div className="mt-6 flex flex-col gap-6 md:gap-0 md:flex-row md:justify-between">

                        <div className="flex flex-row gap-6">
                            <a href="#" className="text-base text-dark-gray font-semibold hover:text-dark">
                                Соглашение о конфиденциальности
                            </a>
                            <a href="#" className="text-base text-dark-gray font-semibold hover:text-dark">
                                Пользовательское соглашение
                            </a>
                        </div>

                        <div className="text-dark-gray font-semibold">
                            «2025© ООО «SED». ИИН XXXXXXXXXXXX. Все права защищены»
                        </div>

                    </div>

                </Container >
            </footer >

        </div >
    );
}

export default Footer;