import { ApiResponse, User } from "@/types";
import { useRef, useState } from "react";

import Button from "@/components/ui/Button";
import CirceLoading from "@/components/loading/CircleLoading";
import Input from "@/components/ui/Input";
import SettingsForm from "./ui/SettingsForm";
import SettingsSection from "./ui/SettingsSection";
import { api } from "@/api/instance";
import citiesJson from '@/_assets/cities.json';
import { cn } from "@/util/utils";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";

function SettingsAccount() {
    const { user, token, setUser } = useAuth();

    const cityRef = useRef<HTMLInputElement>(null);
    const [selectedCity, setCity] = useState('');

    const nameRef = useRef<HTMLInputElement>(null);
    const surnameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);

    const shopNameRef = useRef<HTMLInputElement>(null);
    const shopAddressRef = useRef<HTMLInputElement>(null);

    const [fetching, setFetching] = useState(false);

    const changeCity = async () => {

        if (selectedCity == ""
        ) {
            toast("Заполните все поля", {
                type: 'error',
            })
            return;
        }

        setFetching(true);

        await api.post<ApiResponse<User>>('/users/update', {
            "city": selectedCity
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {

            if (response.data.statusCode == 400) {
                toast(response.data.message, {
                    type: 'error',
                })
                return;
            }

            setUser(response.data.data);

            setFetching(false);
            toast("Успешно сохранено!", {
                type: 'success',
            })

        })
    }

    const changeAccount = async () => {

        if (nameRef.current?.value == ""
            || surnameRef.current?.value == ""
            || phoneRef.current?.value == ""
        ) {
            toast("Заполните все поля", {
                type: 'error',
            })
            return;
        }

        setFetching(true);

        await api.post<ApiResponse<User>>('/users/update', {
            "name": nameRef.current?.value,
            "surname": surnameRef.current?.value,
            "phone": phoneRef.current?.value
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {

            if (response.data.statusCode == 400) {
                toast(response.data.message, {
                    type: 'error',
                })
                return;
            }

            setUser(response.data.data);
            setFetching(false);

            toast("Успешно сохранено!", {
                type: 'success',
            })

        })
    }

    const changeShop = async () => {

        if (shopNameRef.current?.value == ""
            || shopAddressRef.current?.value == ""
        ) {
            toast("Заполните все поля", {
                type: 'error',
            })
            return;
        }

        setFetching(true);

        await api.post<ApiResponse<User>>('/users/update', {
            "shopinfo": {
                "name": shopNameRef.current?.value,
                "address": shopAddressRef.current?.value
            }
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((response) => {

            setFetching(false);

            if (response.data.statusCode == 400) {
                toast(response.data.message, {
                    type: 'error',
                })
                return;
            }

            setUser(response.data.data);
            toast("Успешно сохранено!", {
                type: 'success',
            })

        })
    }

    if (!user || fetching) {
        return <CirceLoading className="w-full grow flex justify-center items-center"></CirceLoading>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

            <SettingsSection
                title="Личные данные"
                className="flex flex-col gap-3"
            >
                <SettingsForm
                    text="Имя"
                >
                    <Input
                        ref={nameRef}
                        placeholder={user.name}
                        type="text"
                        className="w-full"
                        defaultValue={user.name}
                    ></Input>
                </SettingsForm>

                <SettingsForm
                    text="Фамилия"
                >
                    <Input
                        ref={surnameRef}
                        placeholder={user.surname}
                        type="text"
                        className="w-full"
                        defaultValue={user.surname}
                    ></Input>
                </SettingsForm>

                <SettingsForm
                    text="Номер"
                >
                    <Input
                        ref={phoneRef}
                        placeholder={user.phone}
                        type="number"
                        className="w-full"
                        defaultValue={user.phone}
                    ></Input>
                </SettingsForm>

                <Button
                    content="Сохранить"
                    variant="STANDART"
                    className="mt-3 w-fit"
                    onClick={() => {
                        changeAccount()
                    }}
                ></Button>

            </SettingsSection>

            <SettingsSection
                title="Местоположение"
                className="flex flex-col gap-3"
            >
                <SettingsForm
                    text="Город"
                >
                    <Input
                        ref={cityRef}
                        placeholder={user.city}
                        type="text"
                        className="w-full"

                        onInput={(e) => {
                            setCity(e.currentTarget.value)
                        }}
                    ></Input>
                </SettingsForm>

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

                <Button
                    content="Сохранить"
                    variant="STANDART"
                    className="mt-3 w-fit"
                    onClick={() => {
                        changeCity();
                    }}
                ></Button>

            </SettingsSection>

            <SettingsSection
                title="Магазин"
                className="flex flex-col gap-3"
            >
                <SettingsForm
                    text="Название"
                >
                    <Input
                        ref={shopNameRef}
                        placeholder={'Название'}
                        type="text"
                        className="w-full"
                        defaultValue={user.shopinfo.name}
                    ></Input>
                </SettingsForm>

                <SettingsForm
                    text="Адрес"
                >
                    <Input
                        ref={shopAddressRef}
                        placeholder={'Адрес'}
                        type="text"
                        className="w-full"
                        defaultValue={user.shopinfo.address}
                    ></Input>
                </SettingsForm>

                <Button
                    content="Сохранить"
                    variant="STANDART"
                    className="mt-3 w-fit"
                    onClick={() => {
                        changeShop();
                    }}
                ></Button>

            </SettingsSection>

        </div>
    );
}

export default SettingsAccount;