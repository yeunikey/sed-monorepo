import { Box, Collapse, IconButton, TableCell, TableRow, Typography } from "@mui/material";

import { DataSet } from "@/types";
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from "react";

interface RowProps {
    data: DataSet,
    handleDelete: (id: number) => void
}

function DataRow({ data, handleDelete }: RowProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow
                key={data.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {'#' + data.id}
                </TableCell>
                <TableCell sx={{ width: '100%' }}>
                    {data.question}
                </TableCell>
                <TableCell align="right">
                    <IconButton
                        color="error"
                        onClick={() => {
                            handleDelete(data.id)
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, pb: 4 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Ответ ИИ:
                            </Typography>
                            <div className="whitespace-break-spaces">
                                {data.answer}
                            </div>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default DataRow;