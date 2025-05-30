"use client"

import { ApiResponse, User } from "@/types"
import { Socket, io } from "socket.io-client"
import { Swiper, SwiperSlide } from "swiper/react"
import { api, socketUrl, vapi } from "@/api/instance"
import { useEffect, useRef, useState } from "react"

import Image from "next/image"
import Link from "next/link"
import View from "@/components/View"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/auth"

interface Message {
    id: number
    senderId: number
    content: string
    timestamp: string
    chat: Chat,
    type: 'text' | 'image'
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

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Добавим реф для input type="file"
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Отправка изображения
    const sendImage = async (file: File) => {
        if (!selectedChat || !user || !token) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Отправляем файл на сервер и получаем URL изображения
            await vapi.post<{ data: { id: string } }>('/images/upload', formData, {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            }).then((response) => {

                const payload = {
                    chatId: selectedChat.id,
                    senderId: user.id,
                    content: response.data.data.id,
                    type: 'image'
                }

                socket?.emit("sendMessage", payload)
            });

        } catch (error) {
            console.error("Ошибка при загрузке изображения:", error);
            toast.error("Не удалось отправить изображение");
        }
    }

    // Обработчик выбора файла
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            sendImage(files[0])
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Очистить input, чтобы можно было загрузить тот же файл снова
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        // Запускаем запрос через 500ms после последнего ввода
        searchTimeout.current = setTimeout(() => {
            api.get(`/chats/search?query=${encodeURIComponent(searchQuery)}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
                .then((response) => {
                    setSearchResults(response.data.data);
                })
                .catch((error) => {
                    console.error('Ошибка при поиске пользователей:', error);
                });
        }, 500);

        // Очистка таймера при размонтировании или изменении searchQuery
        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [searchQuery, token]);


    const handleUserClick = (selectedUser: User) => {

        api.post<ApiResponse<Chat>>(
            '/chats/create-or-get',
            { receiverId: selectedUser.id },
            {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            }
        )
            .then((response) => {

                if (response.data.statusCode != 200) {
                    toast.error(response.data.message);
                    return;
                }

                const chat: Chat = response.data.data;
                setSearchQuery('');
                setSearchResults([]);

                const search = chats.find(c => c.id == chat.id);

                if (!search) {
                    setSelectedChat(chat);
                    setChats([...chats, chat])
                } else {
                    setSelectedChat(search)
                }

            })
            .catch((error) => {
                console.error('Ошибка при создании или получении чата:', error);
            });
    };

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
            socket = io(socketUrl, {
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

    if (!token) {
        return (
            <></>
        )
    }

    return (
        <View className="mt-12 flex-col" container>

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

            <div className="mt-6 flex flex-col md:flex-row gap-6 md:gap-12 h-full w-full grow">

                <div className="block w-full md:min-w-60 md:w-60 lg:min-w-96 lg:w-96">
                    <div className="relative w-full flex bg-muted rounded-2xl py-3 px-6 gap-6 items-center">
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
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="text-dark text-base w-full outline-none placeholder:text-dark-gray"
                        />


                        {searchResults.length > 0 && (
                            <div className="absolute left-0 top-full z-50 w-full bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((user) => (
                                    <div
                                        key={user.id}
                                        className="p-3 flex items-center cursor-pointer hover:bg-gray-100 transition"
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <img
                                            src={`https://api.sedmarket.kz/v1/images/${user.image}`}
                                            alt={`${user.name} ${user.surname}`}
                                            className="h-10 w-10 rounded-full object-cover mr-3"
                                        />
                                        <div>
                                            <div className="font-semibold text-dark">
                                                {user.name} {user.surname}
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
                                                    {user.rating}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    <div className="block mt-6 md:hidden flex-row overflow-x-scroll hidden-scrollbar md:flex-col gap-2">

                        <Swiper
                            slidesPerView={'auto'}
                            spaceBetween={8}
                            className=""
                        >

                            {chats.length == 0 && (
                                <SwiperSlide key={'testsetsetatee'} style={{ width: 'auto' }}>
                                    <div className="p-3 min-w-48 md:w-full h-20 bg-muted rounded-2xl flex gap-6 cursor-pointer items-center justify-around text-dark-light-gray">
                                        Нет чатов :(
                                    </div>
                                </SwiperSlide>
                            )}

                            {chats.map((chat) => {

                                const friend = chat.participantOne.id === user?.id
                                    ? chat.participantTwo
                                    : chat.participantOne

                                return (
                                    <SwiperSlide key={chat.id} style={{ width: 'auto' }}>
                                        <div className="p-3 min-w-48 md:w-full bg-muted rounded-2xl flex gap-6 cursor-pointer items-center" onClick={() => setSelectedChat(chat)}>

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
                                    </SwiperSlide>
                                )
                            })}
                        </Swiper>
                    </div>

                    <div className="hidden mt-6 md:flex flex-row overflow-x-scroll hidden-scrollbar md:flex-col gap-2">

                        {chats.length == 0 && (
                            <div className="p-3 min-w-48 md:w-full h-20 bg-muted rounded-2xl flex gap-6 cursor-pointer items-center justify-around text-dark-light-gray">
                                Нет чатов :(
                            </div>
                        )}

                        {/* Список чатов */}
                        {chats.map((chat) => {

                            const friend = chat.participantOne.id === user?.id
                                ? chat.participantTwo
                                : chat.participantOne

                            return (
                                <div key={chat.id} className="p-3 min-w-48 md:w-full bg-muted rounded-2xl flex gap-6 cursor-pointer items-center" onClick={() => setSelectedChat(chat)}>

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

                {/* Чат */}
                {selectedChat != null && (
                    <div className="w-full grow flex flex-col h-full">
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

                        {/* Блок с сообщениями */}
                        <div className="relative mt-3 w-full bg-muted rounded-2xl flex flex-col items-end">
                            <div className="h-[50dvh] w-full overflow-y-scroll p-3" ref={containerRef}>
                                <div className="w-full flex flex-col gap-1 justify-end grow pb-16">
                                    {messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-full flex justify-${msg.senderId === user?.id ? "end" : "start"
                                                }`}
                                        >
                                            <div
                                                className={`text-white rounded-2xl ${msg.senderId === user?.id
                                                    ? "bg-primary rounded-se-none"
                                                    : "bg-dark-light-gray rounded-ss-none"
                                                    } ${msg.type == "text" ? "py-3 px-6" : ""}`}
                                            >
                                                <MessageItem message={msg} setSelectedImage={setSelectedImage} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Поле ввода и кнопка отправки изображения */}
                            <div className="absolute bottom-0 w-full p-3">
                                <div className=" mt-6 flex bg-white rounded-2xl py-3 px-6 gap-3 items-center">
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
                                    {/* Кнопка для выбора изображения */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-primary font-bold px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 -960 960 960"><path d="M360-400h400L622-580l-92 120-62-80-108 140Zm-40 160q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" /></svg>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {
                selectedImage && (
                    <div
                        className="fixed inset-0 backdrop-blur-sm bg-opacity-75 flex items-center justify-center z-50"
                        onClick={() => setSelectedImage(null)}
                    >

                        <img
                            src={`https://api.sedmarket.kz/v1/images/${selectedImage}`}
                            alt="Просмотр изображения"
                            className="max-w-[90%] max-h-[90%] rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            }
        </View >
    )
}

function MessageItem({ message, setSelectedImage }: { message: Message, setSelectedImage: (image: string) => void }) {
    const [loading, setLoading] = useState(message.type === 'image');

    if (message.type === 'image') {
        return (
            <div style={{ position: 'relative', width: 'fit-content' }}>
                {loading && (
                    <div
                        style={{
                            width: 300,
                            height: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f0f0f0',
                            borderRadius: 8,
                        }}
                    >
                        <div className="border-primary rounded-full border-t-transparent border-4 animate-spin w-8 h-8" />
                    </div>
                )}
                <img
                    src={`https://api.sedmarket.kz/v1/images/${message.content}`}
                    alt="image-message"
                    style={{
                        maxWidth: '300px',
                        maxHeight: '300px',
                        borderRadius: 8,
                        display: loading ? 'none' : 'block',
                    }}
                    onLoad={() => setLoading(false)}
                    onClick={() => setSelectedImage(message.content)}
                />
            </div>
        );
    }

    return <div>{message.content}</div>;
}

