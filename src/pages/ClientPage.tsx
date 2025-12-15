import { Box, Typography } from "@mui/material"
import { ClientListContainer } from "../containers/ClientListContainer"

export const CLientPage = () => {
    return (
        <Box p={2}>
            <Typography variant="h5">
                Clients
            </Typography>
            <ClientListContainer />
        </Box>
    )
}