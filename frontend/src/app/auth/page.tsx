'use client';

import { ApiResponse, User } from "@/types";
import { Button, TextField, Typography } from "@mui/material";

import Cookies from 'js-cookie';
import Image from "next/image";
import { api } from "@/api/instance";
import { toast } from "react-toastify";
import { useState } from "react";

export default function AuthPage() {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {

        if (login == "" || password == "") {
            toast("Заполните все данные", {
                type: "error"
            })
            return;
        }

        await api.post<ApiResponse<{ token: string, user: User }>>('/auth/login', {
            login: login,
            password: password
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
        <div className="h-dvh w-full px-6 py-20 flex gap-16">

            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="w-72">
                    <div className="flex justify-center">
                        <Image
                            height={708}
                            width={1408}
                            alt="AITU Logo"
                            src={'/logo.png'}
                            className="h-32 w-auto"
                        />
                    </div>

                    <Typography variant="body1" color="grey.700" marginTop={2} textAlign={'center'}>
                        Департамент Маркетинга
                    </Typography>

                    <div className="flex flex-col gap-2 my-8">
                        <TextField value={login} onChange={(e) => setLogin(e.target.value)} id="outlined-basic" label="Логин" variant="outlined" size="small" />
                        <TextField value={password} onChange={(e) => setPassword(e.target.value)} id="outlined-basic" label="Пароль" variant="outlined" type='password' size="small" />
                    </div>

                    <Button variant="contained" className="w-full"
                        onClick={() => {
                            handleLogin();
                        }}
                    >
                        Войти
                    </Button>

                </div>
            </div>
        </div >
    );
}