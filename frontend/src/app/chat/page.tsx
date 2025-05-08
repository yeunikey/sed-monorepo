'use client';;

import { Alert, Box, TextField, Typography } from "@mui/material";

import CheckIcon from '@mui/icons-material/Check';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Links from "@/components/LinkList"
import SmartToyIcon from '@mui/icons-material/SmartToy';
import View from "@/components/View"

export default function DataPage() {

    return (
        <View>

            <Links>
                <Typography sx={{ color: 'inherit' }}>Деп. Маркетинга</Typography>
                <Typography sx={{ color: 'text.primary' }}>Чат С ИИ</Typography>
            </Links>

            <Box sx={{ px: 2, pb: 16, py: 6, display: 'flex', justifyContent: 'center' }}>
                <div className="w-lg flex flex-col gap-6">
                    <Alert severity="info">Данная функция работает в экспериментальном режиме и может отвечать не должным образом.</Alert>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-6 mb-2">
                            <Typography fontWeight={500} variant="h5">Модель:</Typography>
                            <div className="flex gap-2 items-center ">
                                <SmartToyIcon color="primary"></SmartToyIcon>
                                <Typography fontWeight={500} variant="h5">aitu-v1</Typography>
                            </div>
                        </div>
                        <TextField id="outlined-basic" label="Вопрос" variant="outlined" size="small" multiline rows={6} />
                        <div className="flex justify-center">
                            <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                        </div>
                        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Получен ответ.
                        </Alert>
                    </div>

                </div>
            </Box>

        </View>
    )
}