import * as Slider from "@radix-ui/react-slider";

import { Category, SubCategory } from "@/types";
import { useEffect, useState } from "react";

import Input from "@/components/ui/Input";
import SearchCategory from "./SearchCategory";
import citiesJson from '@/_assets/cities.json';
import { cn } from "@/util/utils";
import { useSearch } from "@/hooks/search";
import { useSearchParams } from "next/navigation";

interface ControlProps {
    categories: Category[],
    selectedCategory: Category | null,
    selectedSubCategory: SubCategory | null,
    updateSearchParams: (params: Record<string, string | number | undefined>) => void

}

function SearchControl({ categories, selectedCategory, selectedSubCategory, updateSearchParams }: ControlProps) {

    const searchParams = useSearchParams();

    const { minPrice, maxPrice, setMinPrice, setMaxPrice, city, setCity } = useSearch();
    const [searchCity, setSearchCity] = useState('');

    const [priceRange, setPriceRange] = useState<[number, number]>([Number(searchParams.get('minPrice')), Number(searchParams.get('maxPrice'))]);

    useEffect(() => {
        setPriceRange([minPrice, maxPrice]);
    }, [minPrice, maxPrice]);

    return (
        <div className="min-w-72 w-full md:w-72 flex flex-col gap-6">
            <div>
                <div className="font-semibold text-xl">
                    По категории
                </div>

                <div className="mt-3 flex flex-col gap-3">

                    {categories.map((category) => {
                        return (<SearchCategory key={category.id} category={category} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} />)
                    })}

                </div>
            </div>
            <div>
                <div className="font-semibold text-xl">
                    По цене
                </div>

                <div className="mt-3 flex flex-col gap-3">
                    <div className="flex gap-3">
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">от</span>
                            <input
                                type="number"
                                className="w-full pl-10 p-3 bg-muted rounded-2xl focus:outline-primary text-dark no-spinner"
                                value={priceRange[0]}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">до</span>
                            <input
                                type="number"
                                className="w-full pl-10 p-3 bg-muted rounded-2xl focus:outline-primary text-dark no-spinner"
                                value={priceRange[1]}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>


                    <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-1"
                        value={priceRange}
                        onValueChange={(e) => {
                            setPriceRange([e[0], e[1]]);
                        }}
                        onValueCommit={(e) => {
                            setMinPrice(e[0]);
                            setMaxPrice(e[1]);

                            updateSearchParams({
                                minPrice: e[0],
                                maxPrice: e[1]
                            });
                        }}
                        min={1000}
                        max={1000000}
                        step={100}
                    >
                        <Slider.Track className="relative grow rounded-full h-1 bg-muted">
                            <Slider.Range className="absolute h-full bg-primary rounded-full" />
                        </Slider.Track>
                        <Slider.Thumb
                            className="block w-3 h-3 bg-primary rounded-full focus:outline-none"
                            aria-label="Min price"
                        />
                        <Slider.Thumb
                            className="block w-3 h-3 bg-primary rounded-full focus:outline-none"
                            aria-label="Max price"
                        />
                    </Slider.Root>
                </div>
            </div>

            <div>
                <div className="font-semibold text-xl">
                    По городу
                </div>

                <div className="mt-3">

                    <Input
                        placeholder="Название города"
                        type="text"
                        className=""
                        onInput={(e) => {
                            setSearchCity(e.currentTarget.value);
                        }}
                    ></Input>

                    <div className="mt-6 overflow-y-scroll min-h-64 h-64">
                        <div className="flex flex-wrap gap-2">
                            {city && (
                                <div className={cn("bg-dark text-white py-1 px-3 font-medium rounded-full cursor-pointer")}
                                    onClick={() => {
                                        setCity('');
                                        updateSearchParams({
                                            city: undefined
                                        })
                                    }}
                                >
                                    {city}
                                </div>
                            )}

                            {citiesJson.filter(c => c.startsWith(searchCity) && c != city).map((c, i) => {
                                return (
                                    <div key={i} className={cn("py-1 px-3 font-medium rounded-full cursor-pointer",
                                        ((city != '' && city == c) ? 'bg-dark text-white' : 'bg-muted hover:bg-dark/10')
                                    )}
                                        onClick={() => {
                                            if (city == c) {
                                                setCity('')
                                            } else {
                                                setCity(c)
                                                updateSearchParams({
                                                    city: c
                                                })
                                            }
                                        }}
                                    >
                                        {c}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchControl;