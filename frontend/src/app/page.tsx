'use client'

import { ApiResponse, DataSet } from "@/types"
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react"

import CreateModal from "@/components/pages/data/CreateModal"
import DataRow from "@/components/pages/data/DataRow"
import ImportModal from "@/components/pages/data/ImportModal"
import Links from "@/components/LinkList"
import View from "@/components/View"
import { api } from "@/api/instance"
import { toast } from "react-toastify"
import { useAuth } from "@/hooks/auth"
import { useDataset } from "@/hooks/datasets"

export default function DataPage() {

    const [createModal, setCreateModal] = useState(false);
    const [importModal, setImportModal] = useState(false);

    const { token } = useAuth();
    const { datasets, setDatasets } = useDataset();


    const handleDownload = async () => {
        const headers = ['question', 'answer'];
        const rows = datasets.map(data =>
            [
                data.question.replace(/\n/g, ' '),
                data.answer.replace(/\n/g, ' ')
            ]
        );

        const csvContent =
            [headers, ...rows]
                .map(e => e.map(field => `"${field}"`).join(',')) // защищает поля с запятыми
                .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'datasets.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id: number) => {
        await api.delete<ApiResponse<DataSet[]>>('/datasets?id=' + id, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(({ data }) => {
                if (data.statusCode != 200) {
                    toast.error(data.message);
                }

                setDatasets(datasets.filter(s => s.id != id))

            });
    }

    const fetchData = async () => {
        await api.get<ApiResponse<DataSet[]>>('/datasets', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(({ data }) => {
                setDatasets(data.data)
            });
    }


    useEffect(() => {
        if (token == '') {
            return;
        }

        fetchData();
    }, [token]);


    return (
        <View>

            <CreateModal open={createModal} setOpen={setCreateModal} />
            <ImportModal open={importModal} setOpen={setImportModal} />

            <Links>
                <Typography sx={{ color: 'inherit' }}>Деп. Маркетинга</Typography>
                <Typography sx={{ color: 'text.primary' }}>Датасет</Typography>
            </Links>

            <Box sx={{ px: 2, pb: 16 }}>
                <div className="flex flex-col gap-2 mt-6">
                    <div className="flex gap-2">
                        <Button variant="contained" size="small" disableElevation={true}
                            onClick={() => {
                                setCreateModal(true)
                            }}
                        >
                            Добавить
                        </Button>
                        <Button variant="contained" size="small" disableElevation={true}
                            onClick={() => {
                                setImportModal(true);
                            }}
                        >
                            Импортировать .csv
                        </Button>
                        <Button variant="outlined" size="small" disableElevation={true} onClick={handleDownload}>Экспортировать .csv</Button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>ID</TableCell>
                                    <TableCell>Вопрос</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {datasets.map((data) => (
                                    <DataRow key={data.id} data={data} handleDelete={handleDelete}></DataRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Box>

        </View>
    )
}