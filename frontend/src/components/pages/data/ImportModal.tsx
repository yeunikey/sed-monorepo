import { ApiResponse, DataSet } from "@/types";
import { Box, Button, Divider, List, ListItemButton, ListItemText, Modal, Typography } from "@mui/material";

import Papa from "papaparse";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { api } from "@/api/instance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";
import { useDataset } from "@/hooks/datasets";
import { useState } from "react";

interface ModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}


interface DatasetCSV {
    question: string;
    answer: string;
}

function ImportModal({ open, setOpen }: ModalProps) {

    const { token } = useAuth();
    const [parsedData, setParsedData] = useState<DatasetCSV[]>([]);
    const { setDatasets } = useDataset();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse<DatasetCSV>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const cleaned = results.data.map((row) => ({
                    question: row.question,
                    answer: row.answer,
                }));
                setParsedData(cleaned);
                console.log(cleaned)
            },
            error: () => {
                toast.error('Не удалось распарсить этот .csv файл')
            }
        });
    };

    const [fetching, setFetching] = useState(false);

    const handleSave = async () => {

        if (fetching) {
            toast.warning('Ожидайте ответа')
            return;
        }

        if (parsedData.length == 0) {
            toast.error('.csv файл пуст')
            return;
        }

        setFetching(true);

        await api.post<ApiResponse<DataSet[]>>('/datasets/upload', parsedData,
            {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then(({ data }) => {

                if (data.statusCode != 200) {
                    toast.error(data.message);
                }

                toast.success('Успешно создано!')
                setDatasets(data.data);

                setOpen(false);

            });

    };

    return (
        <div>
            <Modal
                open={open}
                onClose={() => {
                    setParsedData([]);
                    setOpen(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 96 * 5,
                    bgcolor: 'background.paper',
                    p: 3,
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}>
                    <div className="flex flex-col gap-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Импортировать датасет
                        </Typography>
                        <Typography variant="body2" color="text.secondary" margin={0}>
                            Перетащите .csv файл с датасетом (question, answer)
                        </Typography>
                        <Divider />
                    </div>

                    {parsedData.length == 0
                        ? (
                            <label htmlFor="csv-upload">
                                <Box
                                    sx={{
                                        height: 160,
                                        borderRadius: 4,
                                        border: '2px dashed',
                                        borderColor: 'text.secondary',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1.5,
                                        bgcolor: 'background.paper',
                                        cursor: 'pointer',
                                        transition: '0.3s',
                                        '&:hover': { bgcolor: 'action.hover' },
                                    }}
                                >
                                    <UploadFileIcon color="disabled" sx={{ fontSize: 48 }} />
                                    <Typography variant="body1" color="textDisabled" fontWeight={500}>
                                        Перетащите сюда файл
                                    </Typography>
                                </Box>
                                <input
                                    type="file"
                                    id="csv-upload"
                                    accept=".csv"
                                    style={{ display: "none" }}
                                    onChange={handleFileUpload}
                                />
                            </label>
                        )
                        : (
                            <Box>
                                <Typography variant="body1" sx={{ mb: 1 }}>{'Найдено ' + parsedData.length + ' объектов'}</Typography>
                                <List sx={{ maxHeight: (96 * 3), overflowY: 'scroll' }}>
                                    {parsedData.map((csv, i) => {
                                        return (
                                            <ListItemButton key={i}>
                                                <ListItemText primary={csv.question} secondary={csv.answer} />
                                            </ListItemButton>
                                        )
                                    })}
                                </List>
                            </Box>
                        )}

                    <div className="flex justify-end">
                        <Button variant="contained" onClick={handleSave}>
                            Сохранить
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div >
    );
}

export default ImportModal;