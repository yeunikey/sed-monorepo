import View from "@/components/View";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <View container>

      <section className="mt-6 bg-[#86A372] rounded-2xl h-60 flex justify-center items-center overflow-hidden">

        <div className="text-white/25 font-bold text-5xl md:text-8xl">
          СЛАЙДЕР
        </div>

        <div className="absolute left-10 h-9 w-9 bg-dark rounded-full flex justify-center items-center cursor-pointer">
          <Image
            src={'/icons/arrow.svg'}
            alt="arrow icon"
            width={8}
            height={14}

            className="h-3.5 w-auto"
          ></Image>
        </div>

        <div className="absolute right-10 rotate-180 h-9 w-9 bg-dark rounded-full flex justify-center items-center cursor-pointer">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 20 }, (_, i) => {
            return (
              <Link href="/item" key={i} className="flex flex-col gap-5">
                <div className="relative bg-muted rounded-2xl h-32 flex justify-center items-center text-dark/25 font-bold text-4xl">
                  ТОВАР

                  <div className="absolute w-full h-full bottom-0 px-6 flex flex-row gap-1">
                    <div className="group w-full h-full flex items-end">
                      <div className="bottom-0 bg-muted-dark group-hover:bg-dark/50 min-h-1 w-full rounded-ss-2xl rounded-se-2xl" />
                    </div>
                    <div className="group w-full h-full flex items-end">
                      <div className="bottom-0 bg-muted-dark group-hover:bg-dark/50 min-h-1 w-full rounded-ss-2xl rounded-se-2xl" />
                    </div>
                    <div className="group w-full h-full flex items-end">
                      <div className="bottom-0 bg-muted-dark group-hover:bg-dark/50 min-h-1 w-full rounded-ss-2xl rounded-se-2xl" />
                    </div>
                    <div className="group w-full h-full flex items-end">
                      <div className="bottom-0 bg-muted-dark group-hover:bg-dark/50 min-h-1 w-full rounded-ss-2xl rounded-se-2xl" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="text-dark text-lg font-semibold">
                      Примерное название <br />товара
                    </div>

                    <div className="text-dark-light-gray font-semibold">
                      Категория
                    </div>
                  </div>

                  <div className="flex flex-row justify-between">
                    <div className="text-dark font-bold text-2xl text-nowrap">
                      272 ₸
                    </div>

                    <div className="flex flex-row gap-3">
                      <div className="flex flex-row gap-2 items-center">
                        <Image
                          src="/icons/star.svg"
                          alt="star icon"
                          width={17}
                          height={16}

                          className="min-h-4 min-w-4"
                        ></Image>

                        <div className="text-dark font-bold">
                          5,2
                        </div>
                      </div>

                      <div className="bg-dark rounded-full p-2 cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 27 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="white" d="M13.5 24L11.9315 22.6136C9.57588 20.5124 7.62786 18.7068 6.08743 17.1968C4.54701 15.6867 3.32633 14.3426 2.42538 13.1648C1.52443 11.9871 0.895026 10.9128 0.537158 9.94169C0.179053 8.97085 0 7.98568 0 6.98619C0 5.00327 0.679974 3.34312 2.03992 2.00573C3.40011 0.668578 5.08855 0 7.10526 0C8.34584 0 9.51821 0.285269 10.6224 0.855808C11.7265 1.42635 12.6857 2.24455 13.5 3.31041C14.3143 2.24455 15.2735 1.42635 16.3776 0.855808C17.4818 0.285269 18.6542 0 19.8947 0C21.9114 0 23.5999 0.668578 24.9601 2.00573C26.32 3.34312 27 5.00327 27 6.98619C27 7.98568 26.8209 8.97085 26.4628 9.94169C26.105 10.9128 25.4756 11.9871 24.5746 13.1648C23.6737 14.3426 22.4552 15.6867 20.9193 17.1968C19.3836 18.7068 17.4334 20.5124 15.0685 22.6136L13.5 24ZM13.5 21.1681C15.7737 19.1566 17.6447 17.4324 19.1132 15.9956C20.5816 14.559 21.7421 13.3109 22.5947 12.2513C23.4474 11.1918 24.0395 10.2508 24.3711 9.42856C24.7026 8.60652 24.8684 7.79239 24.8684 6.98619C24.8684 5.58895 24.3947 4.42459 23.4474 3.49309C22.5 2.5616 21.3158 2.09586 19.8947 2.09586C18.7726 2.09586 17.7354 2.40884 16.7833 3.0348C15.8315 3.661 15.0777 4.53206 14.5221 5.64798H12.4779C11.913 4.52297 11.1569 3.6497 10.2096 3.02816C9.26219 2.40663 8.22742 2.09586 7.10526 2.09586C5.69321 2.09586 4.51125 2.5616 3.55938 3.49309C2.60751 4.42459 2.13158 5.58895 2.13158 6.98619C2.13158 7.79239 2.29737 8.60652 2.62895 9.42856C2.96053 10.2508 3.55263 11.1918 4.40526 12.2513C5.25789 13.3109 6.41842 14.5568 7.88684 15.9889C9.35526 17.4211 11.2263 19.1475 13.5 21.1681Z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

              </Link>
            )
          })}
        </div>
      </section>

    </View>
  );
}
