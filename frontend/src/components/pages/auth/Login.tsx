'use client';

import { ApiResponse, User } from "@/types";

import Cookies from 'js-cookie';
import { api } from "@/api/instance";
import { cn } from "@/util/utils";
import { toast } from "react-toastify";
import { useRef } from "react";

interface AuthProps {
    setType: (type: "LOGIN" | "REGISTER") => void
}

function Login({ setType }: AuthProps) {

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleLogin = async () => {

        if (emailRef.current?.value == "" || passwordRef.current?.value == "") {
            toast("Заполните все данные", {
                type: "error"
            })
            return;
        }

        await api.post<ApiResponse<{ token: string, user: User }>>('/auth/login', {
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        })
            .then((response) => {

                if (response.data.statusCode == 400) {
                    toast(response.data.message, {
                        type: 'error',
                    })
                    return;
                }

                toast("Успешный вход!", {
                    type: 'success',
                })

                Cookies.set('token', response.data.data.token);

                window.location.href = "/"
            })
    }

    return (
        <div className="w-80">

            <div className="text-4xl text-dark font-semibold text-center">
                Вход в аккаунт
            </div>

            <div className="mt-2 text-dark-light-gray text-lg text-center">
                Заполните все данные ниже
            </div>

            <div className="mt-16 flex flex-col gap-2">
                <input
                    ref={emailRef}
                    type="email"
                    placeholder="Почта"
                    className={cn(
                        "rounded-2xl py-3 px-6 text-dark text-base w-full outline-solid outline-2 bg-muted outline-transparent focus:outline-primary placeholder:text-dark-gray"
                    )}
                />
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Пароль"
                    className={cn(
                        "rounded-2xl py-3 px-6 text-dark text-base w-full outline-solid outline-2 bg-muted `outline-red-500 outline-transparent focus:outline-primary placeholder:text-dark-gray"
                    )}
                />
            </div>

            <div className="mt-8 bg-primary rounded-2xl flex justify-center items-center py-3 text-white text-lg font-medium cursor-pointer"
                onClick={handleLogin}
            >
                Войти
            </div>

            <div className="mt-8 bg-muted-dark w-full h-0.5 relative flex justify-center items-center">
                <div className="absolute bg-white py-2 px-3 text-muted-dark">
                    ещё
                </div>
            </div>

            <div className="mt-8 flex gap-2 items-center justify-center text-lg font-medium">
                <div className="text-dark">
                    Нет аккаунта?
                </div>
                <div className="cursor-pointer text-primary"
                    onClick={() => {
                        setType("REGISTER")
                    }}
                >
                    Создать
                </div>
            </div>

        </div>
    );
}

export default Login;