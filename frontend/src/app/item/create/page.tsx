'use client'

import { ApiResponse, Category, Product, SubCategory } from "@/types";
import { api, vapi } from "@/api/instance";
import { useEffect, useRef, useState } from "react";

import CirceLoading from "@/components/loading/CircleLoading";
import EditCategory from "@/components/pages/item/edit/EditCategory";
import EditForm from "@/components/pages/item/edit/EditForm";
import EditSection from "@/components/pages/item/edit/EditSection";
import Input from "@/components/ui/Input";
import View from "@/components/View";
import citiesJson from '@/_assets/cities.json';
import { cn } from "@/util/utils";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";
import { useCategories } from "@/hooks/category";
import { useRouter } from "next/navigation";

function Create() {
    const { token } = useAuth();
    const router = useRouter();

    const { categories, setCategories } = useCategories();

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);

    const [variables, setVariables] = useState<{ [key: string]: string }>({});
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [productImages, setProductImages] = useState<File[]>([]);

    const mainImageInputRef = useRef<HTMLInputElement | null>(null);
    const productImagesInputRef = useRef<HTMLInputElement | null>(null);
    const nameInputRef = useRef<HTMLInputElement | null>(null);
    const priceInputRef = useRef<HTMLInputElement | null>(null);
    const minCountInputRef = useRef<HTMLInputElement | null>(null);
    const deliverySelectRef = useRef<HTMLSelectElement | null>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);

    const cityRef = useRef<HTMLInputElement>(null);
    const [selectedCity, setCity] = useState('');

    const [isLoading, setLoading] = useState(false);

    const handleChange = (name: string, value: string) => {
        setVariables(prev => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = () => {
        const file = mainImageInputRef.current?.files?.[0];
        if (!file) {
            return;
        }
        setMainImage(file)
    };

    const handleProductImagesChange = () => {
        const files = productImagesInputRef.current?.files;
        if (files) {
            const fileArray = Array.from(files);
            setProductImages(prev => [...prev, ...fileArray]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get<ApiResponse<Category[]>>('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const buildFormData = async () => {

        const name = nameInputRef.current?.value || '';
        const price = priceInputRef.current?.value || '';
        const description = descriptionInputRef.current?.value || '';

        if (name == "") {
            toast('Введите название товара', {
                type: "error"
            })
            return;
        }

        if (price == "" || Number(price) <= 0 || Number(price) > 10000000) {
            toast('Цена неправильно написана', {
                type: "error"
            })
            return;
        }

        if (description == '') {
            toast('Заполните описание товара', {
                type: "error"
            })
            return;
        }

        if (mainImage == null) {
            toast('Загрузите главное изображение товара', {
                type: "error"
            })
            return;
        }

        if (productImages.length == 0) {
            toast('Товар должен содержать хотя бы 1 изображение (не главная картинка)', {
                type: "error"
            })
            return;
        }

        if (!selectedCategory || !selectedSubCategory) {
            toast('Вы не выбрали категорию', {
                type: "error"
            })
            return;
        }

        const minCount = minCountInputRef.current?.value;
        if (!minCount || minCount == "" || Number(minCount) < 0) {
            toast('Укажите мин. количество для закупа', {
                type: "error"
            })
            return;
        }

        const delivery = deliverySelectRef.current?.value;
        if (!delivery) {
            toast('Вы не выбрали тип доставки', {
                type: "error"
            });
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("minCount", minCount);
        formData.append("delivery", delivery);
        formData.append("city", selectedCity == "" ? "Не указано" : selectedCity);
        formData.append("category", selectedCategory ? selectedCategory?.id.toString() : '');

        if (selectedSubCategory?.id) {
            formData.append("subCategory", selectedSubCategory.id.toString());
        }

        formData.append("mainImage", mainImage ? mainImage : '');

        productImages.forEach((file) => {
            formData.append("productImages", file);
        });

        Object.entries(variables).forEach(([key, value]) => {
            formData.append(`variables[${encodeURIComponent(key)}]`, encodeURIComponent(value));
        });

        const response = await vapi.post<ApiResponse<Product>>(
            "/products/create",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        setLoading(false);

        if (response.data.statusCode != 200) {
            toast(response.data.message, {
                type: 'error'
            })
            return;
        }

        router.push('/item/' + response.data.data.id);

    };


    useEffect(() => {
        fetchCategories();
    }, []);

    if (isLoading) {
        return <View className="grow flex items-center justify-center" container>
            <CirceLoading></CirceLoading>
        </View>
    }

    return (
        <View className="mt-12 flex flex-col gap-6 grow" container>
            <div className="flex flex-row gap-2">
                <div className="text-dark-light-gray">
                    SED
                </div>
                <div className="text-dark font-bold">
                    /
                </div>
                <div className="text-dark-light-gray">
                    Товары
                </div>
                <div className="text-dark font-bold">
                    /
                </div>
                <div className="text-dark-light-gray">
                    Создание
                </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-12">
                <div className="min-w-72">
                    <EditSection
                        title="Категория"
                        className="flex flex-col gap-3"
                    >
                        {categories.map((category) => {
                            return (
                                <EditCategory
                                    key={category.id}
                                    category={category}
                                    selectedCategory={selectedCategory}
                                    selectedSubCategory={selectedSubCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    setSelectedSubCategory={setSelectedSubCategory}
                                />
                            );
                        })}
                    </EditSection>

                    <div className="mt-6">
                        <div
                            className="bg-dark rounded-2xl text-white py-2 flex justify-center items-center gap-3 font-medium cursor-pointer"
                            onClick={buildFormData}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                            </svg>
                            Сохранить
                        </div>
                    </div>
                </div>
                <div className="grow grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-6">
                        <EditSection
                            title="Основная информация"
                            className="flex flex-col gap-3"
                        >
                            <EditForm text="Название товара">
                                <Input
                                    ref={nameInputRef}
                                    placeholder="Название товара"
                                    type="text"
                                    className="w-full"
                                />
                            </EditForm>
                            <EditForm text="Стоимость">
                                <Input
                                    ref={priceInputRef}
                                    placeholder="Стоимость"
                                    type="number"
                                    className="w-full"
                                />
                            </EditForm>
                            <EditForm text="Минимальное количество для заказа">
                                <Input
                                    ref={minCountInputRef}
                                    placeholder="Количество"
                                    type="number"
                                    className="w-full"
                                    defaultValue={1}
                                />
                            </EditForm>
                            <EditForm text="Условия доставки">
                                <select className="rounded-2xl py-3 px-6 text-dark text-base w-full outline-none outline-2 bg-muted"
                                    ref={deliverySelectRef}
                                >
                                    <option value={"Самовывоз"}>Самовывоз</option>
                                    <option value={"Курьер"}>Курьер</option>
                                    <option value={"Почта"}>Почта</option>
                                </select>
                            </EditForm>
                        </EditSection>
                        <EditSection title="Подробное описание" className="flex flex-col gap-3">
                            <textarea
                                ref={descriptionInputRef}
                                className="p-6 rounded-2xl min-h-64 bg-muted focus:outline-solid focus:outline-primary"
                                placeholder="Подробное описание"
                            />
                        </EditSection>
                        {selectedSubCategory && (
                            <EditSection
                                title="Харектеристика"
                                className="flex flex-col gap-3"
                            >
                                {selectedSubCategory.vars.map((variable) => (
                                    <EditForm key={variable.id} text={variable.name}>
                                        <Input
                                            placeholder="Введите значение"
                                            type="text"
                                            className="w-full"
                                            value={variables[variable.name] || ""}
                                            onChange={(e) => handleChange(variable.name, e.target.value)}
                                        />
                                    </EditForm>
                                ))}
                            </EditSection>
                        )}
                    </div>
                    <div className="flex flex-col gap-6">
                        <EditSection title="Изображения" className="flex flex-col gap-3">
                            <EditForm text="На главной странице">
                                <div className="flex flex-col gap-3">
                                    <Input
                                        ref={mainImageInputRef}
                                        type="file"
                                        className="w-full"
                                        accept="image/*"
                                        onChange={handleMainImageChange}
                                    />
                                    <div className="w-full aspect-square rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                                        {mainImage ? (
                                            <img src={URL.createObjectURL(mainImage)} alt="Предпросмотр" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-dark-light-gray">Предпросмотр изображения</span>
                                        )}
                                    </div>
                                </div>
                            </EditForm>
                        </EditSection>

                        <EditSection title="Изображения товара" className="flex flex-col gap-3">
                            <Input
                                ref={productImagesInputRef}
                                type="file"
                                className="w-full"
                                accept="image/*"
                                onChange={handleProductImagesChange} // Обрабатываем каждый выбор файла
                            />
                            <div className="mt-3 grid grid-cols-3 gap-3">
                                {productImages.map((image, index) => (
                                    <div key={index} className="relative w-full h-32 bg-muted rounded-2xl overflow-hidden">
                                        <img src={URL.createObjectURL(image)} alt="Product Image" className="object-cover w-full h-full" />
                                        <div
                                            className="absolute top-2 right-2 bg-red-600 rounded-2xl bg-opacity-50 p-1 cursor-pointer"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>                                        </div>
                                    </div>
                                ))}
                            </div>
                        </EditSection>
                    </div>
                    <div className="flex flex-col gap-6">
                        <EditSection
                            title="Местоположение"
                            className="flex flex-col gap-3"
                        >
                            <EditForm text="Город">
                                <Input
                                    ref={cityRef}
                                    placeholder={'Не указано'}
                                    type="text"
                                    className="w-full"

                                    onInput={(e) => {
                                        setCity(e.currentTarget.value)
                                    }}
                                ></Input>
                            </EditForm>
                            <div className="mt-3 text-xl font-semibold">
                                Выбрать из списка
                            </div>

                            <div className="min-h-64 h-64 overflow-y-scroll">
                                {citiesJson.filter(c => c.startsWith(selectedCity)).map((city, i) => {
                                    return (
                                        <div key={i} className={cn("mb-1 mx-6 py-2 px-6 bg-muted rounded-2xl cursor-pointer",
                                            (selectedCity == city ? 'bg-dark text-white' : 'hover:bg-dark/10')
                                        )}
                                            onClick={() => {
                                                setCity(city)
                                                if (cityRef.current) {
                                                    cityRef.current.value = city;
                                                }
                                            }}
                                        >
                                            {city}
                                        </div>
                                    )
                                })}
                            </div>
                        </EditSection>
                    </div>
                </div>
            </div>
        </View>
    );
}

export default Create;
