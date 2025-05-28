"use client";

import { ApiResponse, SavedImage } from "@/types";
import { api, vapi } from "@/api/instance";
import { useRef, useState } from "react";

import Button from "@/components/ui/Button";
import CirceLoading from "@/components/loading/CircleLoading";
import Input from "@/components/ui/Input";
import SettingsForm from "./ui/SettingsForm";
import SettingsSection from "./ui/SettingsSection";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";

function SettingsImage() {
    const { user, token, setUser } = useAuth();

    const [fetching, setFetching] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const changeImage = async () => {
        const file = fileRef.current?.files?.[0];

        if (!file) {
            toast("Пожалуйста, выберите изображение", { type: "warning" });
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setFetching(true);

            const imageRes = await vapi.post<ApiResponse<SavedImage>>(
                "/images/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                }
            );

            if (imageRes.data.statusCode === 400) {
                toast(imageRes.data.message, { type: "error" });
                return;
            }

            const updateRes = await api.post(
                "/users/update",
                {
                    "image": imageRes.data.data.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            setUser(updateRes.data.data);
            toast("Аватар успешно обновлён!", { type: "success" });

        } catch {
            toast("Ошибка при загрузке изображения", { type: "error" });
        } finally {
            setFetching(false);
        }
    };

    if (!user || fetching) {
        return <CirceLoading className="w-full grow flex justify-center items-center" />;
    }

    return (
        <div className="flex flex-wrap gap-12">

            <SettingsSection
                title="Изменить аватар"
                className="flex flex-col gap-3"
            >
                <SettingsForm text="Выбрать изображение">
                    <Input
                        type="file"
                        className="w-full"
                        accept="image/*"
                        ref={fileRef}
                    />
                </SettingsForm>

                <Button
                    content="Сохранить"
                    variant="STANDART"
                    className="mt-3 w-fit"
                    onClick={changeImage}
                />
            </SettingsSection>

            <img
                src={"https://api.sedmarket.kz/v1/images/" + user.image}
                alt="logo"
                className="w-48 h-48 bg-muted rounded-full object-cover"
                width={1024}
                height={1024}
            >
            </img>

        </div>
    );
}

export default SettingsImage;
