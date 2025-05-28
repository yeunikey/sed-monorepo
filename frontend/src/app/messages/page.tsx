"use client"

import { Socket, io } from "socket.io-client"
import { useEffect, useRef, useState } from "react"

import Image from "next/image"
import Link from "next/link"
import { User } from "@/types"
import View from "@/components/View"
import { api } from "@/api/instance"
import { useAuth } from "@/hooks/auth"

interface Message {
    id: number
    senderId: number
    content: string
    timestamp: string
    chat: Chat
}

interface Chat {
    id: number
    participantOne: User
    participantTwo: User
}

let socket: Socket | null = null;

export default function Messages() {
    const { user, token } = useAuth();

    const [chats, setChats] = useState<Chat[]>([])
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
    const [messages, setMessages] = useState<Message[]>([])

    const [friend, setFriend] = useState<User | null>(null);

    const [newMessage, setNewMessage] = useState("")

    const selectedChatRef = useRef<Chat | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // Функция прокрутки блока вниз:
    function scrollToBottom() {
        const container = containerRef.current;
        if (container) {
            container.scroll({ behavior: 'smooth', top: container.scrollHeight })
        }
    }

    // Например, вызвать после загрузки новых сообщений:
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        selectedChatRef.current = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        if (!token || !user) return;

        if (!socket) {
            socket = io("http://localhost:3001", {
                transports: ["websocket"],
            });

            socket.on("connect", () => {
                console.log("✅ Socket connected:", socket?.id)
            });

            socket.on("disconnect", () => {
                console.log("❌ Socket disconnected")
            });

            socket.on("newMessage", (message: Message) => {
                if (message.chat.id === selectedChatRef?.current?.id) {
                    setMessages((prev) => [...prev, message])

                    setTimeout(() => {
                        scrollToBottom();
                    }, 50);
                }
            });
        }

        return () => {
            socket?.disconnect()
            socket = null
        }
    }, [token, user]);

    // 1. Получение чатов
    useEffect(() => {
        if (token == "") return

        api.get("/chats/my", {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((data) => setChats(data.data.data))
    }, [token])

    // 2. Получение сообщений при выборе чата
    useEffect(() => {
        if (selectedChat == null || token == "") return

        api.get(`/chats/${selectedChat?.id}/messages`, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then((data) => {
                setMessages(data.data.data)
                setTimeout(() => {
                    scrollToBottom();
                }, 50);
            })

        socket?.emit("joinChat", selectedChat?.id)

    }, [selectedChat])


    useEffect(() => {

        if (selectedChat == null) return;

        setFriend(selectedChat.participantOne.id === user?.id
            ? selectedChat.participantTwo
            : selectedChat.participantOne)

    }, [selectedChat])

    // 3. Отправка сообщения
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat || !user) return

        const payload = {
            chatId: selectedChat.id,
            senderId: user.id,
            content: newMessage.trim(),
        }

        socket?.emit("sendMessage", payload)
        setNewMessage("")
    }

    return (
        <View className="mt-12 h-full grow" container>

            <div className="flex flex-row gap-2">
                <div className="text-dark-light-gray">
                    SED
                </div>
                <div className="text-dark font-bold">
                    /
                </div>
                <div className="text-dark-light-gray">
                    Сообщения
                </div>
            </div>

            <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-12">

                <div className="md:block w-full md:min-w-60 md:w-60 lg:min-w-96 lg:w-96">
                    <div className="w-full hidden sm:flex bg-muted rounded-2xl py-3 px-6 gap-6 items-center">
                        <Image
                            src="/icons/search.svg"
                            alt="search icon"
                            width={16}
                            height={16}
                            className="h-4 w-auto"
                        />

                        <input
                            type="text"
                            placeholder="Имя посредника"
                            className="text-dark text-base w-full outline-none placeholder:text-dark-gray"
                        />
                    </div>

                    <div className="mt-6 flex flex-row overflow-x-scroll hidden-scrollbar md:flex-col gap-2">

                        {/* Список чатов */}
                        <div className="bg-muted p-3 rounded-2xl">
                            {chats.map((chat) => {

                                const friend = chat.participantOne.id === user?.id
                                    ? chat.participantTwo
                                    : chat.participantOne

                                return (
                                    <div key={chat.id} className="p-3 min-w-48 md:w-full bg-muted rounded-2xl flex gap-6 cursor-pointer" onClick={() => setSelectedChat(chat)}>

                                        <img src={'https://api.sedmarket.kz/v1/images/' + friend.image} className="bg-dark-light-gray rounded-full h-12 w-12 object-cover" />

                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold text-dark line-clamp-1">
                                                {friend.name + " " + friend.surname}
                                            </div>
                                            <div className="hidden md:flex flex-row gap-2 items-center">
                                                <Image
                                                    src="/icons/star.svg"
                                                    alt="star icon"
                                                    width={14}
                                                    height={14}

                                                    className="min-h-3.5 min-w-3.5"
                                                ></Image>

                                                <div className="text-dark font-bold text-sm">
                                                    {friend.rating}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* Чат */}
                {selectedChat != null && (
                    <div className="w-full grow flex flex-col">
                        <Link className="p-3 bg-muted rounded-2xl flex gap-6 cursor-pointer" href={'/profile/' + friend?.id}>
                            <img src={'https://api.sedmarket.kz/v1/images/' + friend?.image} className="bg-dark-light-gray rounded-full h-12 w-12 object-cover" />

                            <div className="flex flex-col gap-1">
                                <div className="font-semibold text-dark line-clamp-1">
                                    {friend?.name + " " + friend?.surname}
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <Image
                                        src="/icons/star.svg"
                                        alt="star icon"
                                        width={14}
                                        height={14}

                                        className="min-h-3.5 min-w-3.5"
                                    ></Image>

                                    <div className="text-dark font-bold text-sm">
                                        {friend?.rating}
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="relative mt-3 w-full bg-muted rounded-2xl flex flex-col items-end">
                            <div className="h-[400px] w-full overflow-y-scroll p-3" ref={containerRef}>
                                <div className="w-full flex flex-col gap-1 justify-end grow pb-16">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-full flex justify-${msg.senderId === user?.id ? "end" : "start"
                                                }`}
                                        >
                                            <div
                                                className={`py-3 px-6 text-white rounded-2xl ${msg.senderId === user?.id
                                                    ? "bg-primary rounded-se-none"
                                                    : "bg-dark-light-gray rounded-ss-none"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute bottom-0 w-full p-3">
                                <div className=" mt-6 flex bg-white rounded-2xl py-3 px-6 gap-6 items-center">
                                    <Image
                                        src="/icons/messages.svg"
                                        alt="messages icon"
                                        width={16}
                                        height={16}
                                        className="h-4 w-auto"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Напишите сообщение..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        className="text-dark text-base w-full outline-none placeholder:text-dark-gray"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </View>
    )
}
