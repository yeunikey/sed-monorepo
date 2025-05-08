import { ApiResponse, DataSet } from "@/types";
import { Box, Button, Divider, Modal, TextField, Typography } from "@mui/material";

import { api } from "@/api/instance";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/auth";
import { useDataset } from "@/hooks/datasets";
import { useState } from "react";

interface ModalProps {
    open: boolean,
    setOpen: (open: boolean) => void
}

function CreateModal({ open, setOpen }: ModalProps) {
    const { token } = useAuth();

    const { datasets, setDatasets } = useDataset();

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const [fetching, setFetching] = useState(false);

    const handleCreate = async () => {

        if (fetching) {
            toast.warning('Ожидайте ответа')
            return;
        }

        if (question == "" || answer == '') {
            toast.error('Заполните все поля')
            return;
        }

        setFetching(true);

        const body = {
            question: question,
            answer: answer
        };

        await api.post<ApiResponse<DataSet>>('/datasets', body,
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

                const newData = datasets;
                newData.push(data.data);
                setDatasets(newData);

                setOpen(false);
                setFetching(false);
            });
    }

    return (
        <div className="test">
            <Modal
                open={open}
                onClose={() => {
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
                            Добавить датасет
                        </Typography>

                        <Typography variant="body2" color="text.secondary" margin={0}>Заполните все поля ниже</Typography>

                        <Divider />
                    </div>
                    <div className="flex flex-col gap-3">
                        <TextField id="outlined-basic" label="Вопрос" variant="outlined" size="small" rows={2} multiline value={question} onChange={(e) => setQuestion(e.target.value)} className="line-clamp-1" />
                        <TextField id="outlined-basic" label="Ответ" variant="outlined" size="small" value={answer} multiline rows={6} onChange={(e) => setAnswer(e.target.value)} />
                    </div>

                    <div className="flex justify-end">
                        <Button variant="contained" onClick={handleCreate}>Сохранить</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default CreateModal;