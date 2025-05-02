'use client';

import { ApiResponse, User } from "@/types";
import { ReactNode, useEffect, useState } from "react";

import BlurLoading from "./loading/BlurLoading";
import Cookies from 'js-cookie';
import { api } from "@/api/instance";
import { useAuth } from "@/hooks/auth";

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

                if (response.data.statusCode != 200) {
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
            {isLoading && (<BlurLoading></BlurLoading>)}
            {children}
        </>
    );
}

export default Authorize;
