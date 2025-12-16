import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import type { Client } from "../types/client"

type Props = {
    clients: Client[]
    onSelectClient: (client: Client) => void
}

export const ClientTable = ({ clients, onSelectClient }: Props) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                </TableRow>
            </TableHead>

            <TableBody>
                {clients.map(client => (
                    <TableRow key={client.id} onClick={() => onSelectClient(client)}>
                        <TableCell>{client.id}</TableCell>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}