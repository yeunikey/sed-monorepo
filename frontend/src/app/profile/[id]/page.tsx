'use client';;

import { ApiResponse, User } from "@/types";
import { useEffect, useState } from "react";

import ProfileInfo from "@/components/pages/profile/ProfileInfo";
import View from "@/components/View";
import { api } from "@/api/instance";
import { useParams } from "next/navigation";

export default function Profile() {
    const params = useParams();

    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [pageUser, setPageUser] = useState<User | null>(null);

    const fetchUser = async () => {
        await api.get<ApiResponse<User>>('/users/get/' + params.id)
            .then((response) => {

                setLoading(false);

                if (response.data.statusCode == 400) {
                    setError(true);
                    return;
                }

                setPageUser(response.data.data);

            })
    }

    useEffect(() => {
        fetchUser();
    }, [])

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
                    Пользователи
                </div>
                <div className="text-dark font-bold">
                    /
                </div>
                <div className="text-dark-light-gray">
                    {pageUser
                        ? (
                            <>
                                {pageUser?.name + ' ' + pageUser?.surname[0] + '.'}
                            </>
                        )
                        : (
                            <>
                                ...
                            </>
                        )
                    }
                </div>
            </div>

            <ProfileInfo pageUser={pageUser} error={error} isLoading={isLoading} />

        </View>
    )
}