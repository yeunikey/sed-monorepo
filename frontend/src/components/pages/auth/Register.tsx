'use client';;

import { ApiResponse, User } from "@/types";
import { useRef, useState } from "react";

import Cookies from 'js-cookie';
import { api } from "@/api/instance";
import { cn } from "@/util/utils";
import { toast } from "react-toastify";

interface AuthProps {
    setType: (type: "LOGIN" | "REGISTER") => void
}

function Register({ setType }: AuthProps) {

    const [status, setStatus] = useState<"CODE" | "FORM">("FORM")
    const [email, setEmail] = useState<string | null>(null);

    return (
        <>
            {status == "FORM"
                ? (<>
                    <Form setType={setType} setStatus={setStatus} setEmail={setEmail} />
                </>)
                : (<>
                    <Code email={email} />
                </>)}
        </>
    )
}

function Code({ email }: { email: string | null }) {

    const codeRef = useRef<HTMLInputElement>(null);
    const [isError, setError] = useState(false);

    const handleCode = async () => {

        if (!codeRef) {
            setError(true);
            return;
        }

        await api.post<ApiResponse<{ token: string, user: User }>>('/auth/confirm', {
            email: email,
            code: codeRef.current?.value
        })
            .then((response) => {

                if (response.data.statusCode == 400) {
                    toast(response.data.message, {
                        type: 'error',
                    })
                    return;
                }

                Cookies.set('token', response.data.data.token);

                window.location.href = "/"

                toast("Успешное создание!", {
                    type: 'success',
                })
            })

    }

    return (
        <div className="w-80 mt-24">

            <div className="text-4xl text-dark font-semibold text-center">
                Подтверждение почты
            </div>

            <div className="mt-2 text-dark-light-gray text-lg text-center">
                Введите код ниже
            </div>

            <div className="mt-16 flex flex-col gap-2">
                <input
                    ref={codeRef}
                    type="number"
                    placeholder="Код"
                    className={cn(
                        "rounded-2xl py-3 px-6 text-dark text-base w-full outline-solid outline-2 bg-muted",
                        isError ? "outline-red-500" : "outline-transparent focus:outline-primary placeholder:text-dark-gray"
                    )}
                />
            </div>

            <div className="mt-8 bg-primary rounded-2xl flex justify-center items-center py-3 text-white text-lg font-medium cursor-pointer"
                onClick={handleCode}
            >
                Подтвердить
            </div>
        </div>
    )
}

function Form({ setType, setStatus, setEmail }: AuthProps & { setStatus: (status: "CODE" | "FORM") => void, setEmail: (email: string) => void }) {

    const nameRef = useRef<HTMLInputElement>(null);
    const surnameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const numberRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const repeatPasswordRef = useRef<HTMLInputElement>(null);

    const handleCreate = async () => {
        const name = nameRef.current?.value.trim() || "";
        const surname = surnameRef.current?.value.trim() || "";
        const email = emailRef.current?.value.trim() || "";
        const phone = numberRef.current?.value.trim() || "";
        const password = passwordRef.current?.value || "";
        const repeatPassword = repeatPasswordRef.current?.value || "";

        if (name == "" || surname == "" || email == "" || phone == "" || password == "" || repeatPassword == "") {
            toast("Заполните все поля", {
                type: 'error',
            })
            return;
        }

        if (password !== repeatPassword) {
            toast("Пароли отличаются от друг-друга", {
                type: 'error',
            })
            return;
        }

        await api.post<ApiResponse<null>>('/auth/register', {
            user: {
                name: name,
                surname: surname,
                email: email,
                phone: phone,
                password: password
            }
        }).then((response) => {

            if (response.data.statusCode == 200) {
                setEmail(email);
                setStatus("CODE")

                toast("Вам на почту был отправлен код", {
                    type: 'warning',
                })
            }

        })
    }

    const inputClass = () =>
        cn(
            "rounded-2xl py-3 px-6 text-dark text-base w-full outline-solid outline-2 bg-muted outline-transparent focus:outline-primary placeholder:text-dark-gray"
        );

    return (
        <div className="w-80 mt-24">

            <div className="text-4xl text-dark font-semibold text-center">
                Создать аккаунт
            </div>

            <div className="mt-2 text-dark-light-gray text-lg text-center">
                Заполните все данные ниже
            </div>

            <div className="mt-16 flex flex-col gap-2">
                <input ref={nameRef} type="text" placeholder="Имя" className={inputClass()} />
                <input ref={surnameRef} type="text" placeholder="Фамилия" className={inputClass()} />
                <input ref={emailRef} type="email" placeholder="Почта" className={inputClass()} />
                <input ref={numberRef} type="number" placeholder="Номер" className={inputClass()} />
                <input ref={passwordRef} type="password" placeholder="Пароль" className={inputClass()} />
                <input ref={repeatPasswordRef} type="password" placeholder="Повтор пароля" className={inputClass()} />
            </div>

            <div className="mt-8 bg-primary rounded-2xl flex justify-center items-center py-3 text-white text-lg font-medium cursor-pointer"
                onClick={handleCreate}
            >
                Создать
            </div>

            <div className="mt-8 bg-muted-dark w-full h-0.5 relative flex justify-center items-center">
                <div className="absolute bg-white py-2 px-3 text-muted-dark">
                    ещё
                </div>
            </div>

            <div className="mt-8 flex gap-2 items-center justify-center text-lg font-medium">
                <div className="text-dark">
                    Есть аккаунт?
                </div>
                <div className="cursor-pointer text-primary"
                    onClick={() => {
                        setType("LOGIN")
                    }}
                >
                    Войти
                </div>
            </div>

        </div>
    );
}



export default Register;