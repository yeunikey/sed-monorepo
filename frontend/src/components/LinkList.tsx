import { Box, Breadcrumbs, Divider } from "@mui/material";
import { ReactNode } from "react";

interface ListProps {
    children?: ReactNode
}

function Links({ children }: ListProps) {
    return (
        <Box>
            <Breadcrumbs aria-label="breadcrumb" sx={{ px: 3, py: 2 }} className="h-full flex items-center">
                {children}
            </Breadcrumbs>

            <Divider />
        </Box >
    );
}

export default Links;