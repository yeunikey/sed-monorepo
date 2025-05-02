import { ApiResponse, User } from "@/types";
import { useRef, useState } from "react";

import Button from "@/components/ui/Button";
import CirceLoading from "@/components/loading/CircleLoading";
import Input from "@/components/ui/Input";
import SettingsForm from "./ui/SettingsForm";
import SettingsSection from "./ui/SettingsSection";
import { api } from "@/api/instance";
import { cn } from "@/util/utils";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";

function SettingsSecurity() {
    const { user, token, setUser } = useAuth();

    const oldPassword = useRef<HTMLInputElement>(null);
    const newPassword = useRef<HTMLInputElement>(null);
    const repeatPassword = useRef<HTMLInputElement>(null);

    const [waitingCode, setWaitingCode] = useState(false);
    const mailRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    const [fetching, setFetching] = useState(false);

    const changePassword = async () => {

        if (oldPassword.current?.value == ""
            || newPassword.current?.value == ""
            || repeatPassword.current?.value == ""
        ) {
            toast("Заполните все поля", {
                type: 'error',
            })
            return;
        }

        if (newPassword.current?.value != repeatPassword.current?.value) {
            toast("Пароли не совпадают", {
                type: 'error',
            })
            return;
        }

        setFetching(true);

        await api.post('/auth/change-password', {
            oldPassword: oldPassword.current?.value,
            newPassword: newPassword.current?.value,
            repeatPassword: repeatPassword.current?.value
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then((response) => {

            setFetching(false);

            if (response.data.statusCode == 400) {
                toast(response.data.message, {
                    type: 'error',
                })
                return;
            }

            toast("Успешно сохранено!", {
                type: 'success',
            })

        })

    }

    const changeMail = async () => {

        if (waitingCode) {
            return;
        }

        if (mailRef.current?.value == "") {
            toast("Заполните все поля", {
                type: 'error',
            })
            return;
        }

        await api.post('/auth/change-mail', {
            newMail: mailRef.current?.value
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(({ data: req }) => {

            if (req.statusCode == 400) {
                toast(req.message, {
                    type: 'error',
                })
                return;
            }

            setWaitingCode(true);

            toast("Вам на новую почту отправлено письмо!", {
                type: 'warning',
            })

        })
    }

    const confirmMail = async () => {

        if (!waitingCode) {
            return;
        }

        if (codeRef.current?.value == "") {
            toast("Заполните все поля", {
                type: 'error',
            })
            return;
        }

        await api.post<ApiResponse<User>>('/auth/confirm-mail', {
            email: mailRef.current?.value,
            code: codeRef.current?.value
        }, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(({ data: req }) => {

            if (req.statusCode == 400) {
                return;
            }

            setWaitingCode(false);
            setUser(req.data)

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
                title="Смена пароля"
                className="flex flex-col gap-3"
            >
                <SettingsForm
                    text="Старый пароль"
                >
                    <Input
                        ref={oldPassword}
                        placeholder="Старый пароль"
                        type="password"
                        className="w-full"
                    ></Input>
                </SettingsForm>

                <SettingsForm
                    text="Новый пароль"
                >
                    <Input
                        ref={newPassword}
                        placeholder="Новый пароль"
                        type="password"
                        className="w-full"
                    ></Input>
                </SettingsForm>

                <SettingsForm
                    text="Повтор пароля"
                >
                    <Input
                        ref={repeatPassword}
                        placeholder="Повтор пароля"
                        type="password"
                        className="w-full"
                    ></Input>
                </SettingsForm>

                <Button
                    content="Сохранить"
                    variant="STANDART"
                    className="mt-3 w-fit"
                    onClick={changePassword}
                ></Button>
            </SettingsSection>

            <SettingsSection
                title="Почта"
                className="flex flex-col gap-3"
            >
                <div className={cn(!waitingCode ? 'opacity-100' : 'opacity-75 pointer-events-none', 'transition-all')}>
                    <SettingsForm
                        text="Новая почта"
                        className="flex gap-2"
                    >
                        <Input
                            ref={mailRef}
                            placeholder={user.email}
                            type="email"
                            className="w-full"
                        ></Input>

                        <div className="!h-full aspect-square flex justify-center items-center rounded-2xl bg-dark cursor-pointer"
                            onClick={changeMail}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" /></svg>
                        </div>
                    </SettingsForm>
                </div>

                <div className={cn(waitingCode ? 'opacity-100' : 'opacity-0 pointer-events-none', 'transition-all')}>
                    <SettingsForm
                        text="Код подтверждения"
                        className="flex gap-2"
                    >
                        <Input
                            ref={codeRef}
                            placeholder={'Код'}
                            type="text"
                            className="w-full"
                        ></Input>

                        <div className="!h-full aspect-square flex justify-center items-center rounded-2xl bg-dark"
                            onClick={confirmMail}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" /></svg>
                        </div>
                    </SettingsForm>
                </div>

            </SettingsSection>

        </div>
    );
}

export default SettingsSecurity;