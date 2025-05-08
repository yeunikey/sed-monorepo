'use client'

import { ApiResponse, User } from "@/types";
import { ReactNode, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { api } from "@/api/instance";
import { useAuth } from "@/hooks/auth";
import Loading from "./Loading";

interface AuthProps {
    children?: ReactNode
}

function Authorize({ children }: AuthProps) {
    const { setToken, setUser } = useAuth();

    const [isLoading, setLoading] = useState(true);

    const fetchData = async () => {

        if (!Cookies.get('token')) {
            setTimeout(() => {
                setLoading(false);
            }, 500)
            return;
        }

        const token = String(Cookies.get('token'));

        await api.get<ApiResponse<User>>('/auth/profile', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((response) => {

                if (response.data.statusCode == 400) {
                    setLoading(false);
                    Cookies.remove('token');
                    return;
                }

                setToken(token);
                setUser(response.data.data);

                setLoading(false);

            })

    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            {isLoading && (
                <div className="w-full h-dvh flex items-center justify-center">
                    <Loading></Loading>
                </div>
            )}
            {children}
        </>
    );
}

export default Authorize;
