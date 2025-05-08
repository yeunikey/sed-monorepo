'use client'

import { ApiResponse, User } from "@/types";
import {
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import DeleteIcon from '@mui/icons-material/Delete'
import Links from "@/components/LinkList";
import View from "@/components/View";
import { api } from "@/api/instance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const { token, user } = useAuth();
    const router = useRouter();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const [admins, setAdmins] = useState<User[]>([]);

    const handleCreate = async () => {

        if (login == "" || password == '') {
            toast.error('Заполните все поля');
            return;
        }

        await api.post<ApiResponse<User>>('/users', {
            login, password
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(({ data }) => {

                if (data.statusCode != 200) {
                    toast.error(data.message);
                    return;
                }

                setAdmins([...admins, data.data]);
                toast.success('Пользователь добавлен')

            })
    }

    const handleDelete = async (id: number) => {
        await api.delete<ApiResponse<User>>('/users', {
            headers: {
                Authorization: 'Bearer ' + token
            },
            params: {
                id: id
            }
        })
            .then(({ data }) => {

                if (data.statusCode != 200) {
                    toast.error(data.message);
                    return;
                }

                setAdmins(admins.filter(u => u.id != id));

                toast.success('Пользователь удалён')
            })
    }

    const fetchAdmins = async () => {
        await api.get<ApiResponse<User[]>>('/users', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(({ data }) => {

            if (data.statusCode != 200) {
                toast.error(data.message);
                return;
            }

            setAdmins(data.data);
        })
    }

    useEffect(() => {
        if (user == null) {
            return;
        }

        if (user.role != "ADMIN") {
            router.push('/');
            return;
        }

        fetchAdmins();
    }, [user])

    return (
        <View>

            <Links>
                <Typography sx={{ color: 'inherit' }}>Деп. Маркетинга</Typography>
                <Typography sx={{ color: 'text.primary' }}>Пользователи</Typography>
            </Links>

            <Box sx={{ px: 2, py: 3, pb: 16, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack spacing={2} direction="row">
                    <TextField
                        size="small"
                        label="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <TextField
                        size="small"
                        label="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleCreate}>Создать</Button>
                </Stack>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Логин</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {admins.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell>{admin.login}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" disableElevation color="error" startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(admin.id)}
                                        >
                                            Удалить
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </View>
    )
}