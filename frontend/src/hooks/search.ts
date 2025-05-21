import { Category, SubCategory } from "@/types";

import { create } from "zustand";

type SearchType = {
    category: Category | null;
    setCategory: (category: Category | null) => void;

    subcategory: SubCategory | null;
    setSubCategory: (subcategory: SubCategory | null) => void;

    loading: boolean;
    setLoading: (loading: boolean) => void;


    minPrice: number;
    setMinPrice: (price: number) => void;


    maxPrice: number;
    setMaxPrice: (price: number) => void;

    city: string;
    setCity: (city: string) => void;

    text: string;
    setText: (text: string) => void;

};

export const useSearch = create<SearchType>((set) => ({
    category: null,

    setCategory: (category) => set({
        category: category
    }),

    subcategory: null,

    setSubCategory: (subcategory) => set({
        subcategory: subcategory
    }),

    loading: true,
    setLoading: (loading) => set({
        loading: loading
    }),

    minPrice: 0,
    setMinPrice: (price) => set({
        minPrice: price
    }),

    maxPrice: 1000000,
    setMaxPrice: (price) => set({
        maxPrice: price
    }),

    city: '',
    setCity: (city) => set({
        city: city
    }),

    text: '',
    setText: (text) => set({
        text: text
    }),
}));