import { useEffect, useState } from "react"
import type { Client } from "../types/client"
import { ClientTable } from "../components/ClientTable"
import { FetchClients } from "../services/clientApi"
import { Drawer } from "@mui/material"

export const ClientListContainer = () => {
    const [clients, setClients] = useState<Client[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectdClient, setselectedClients] = useState<Client | null>(null)
    const [drawerOpen, setDraweropen] = useState(false)

    const handSelectClient = (client: Client) => {
        setselectedClients(client)
        setDraweropen(true)
    }

    const handleCloseDrawer = () => {
        setDraweropen(false)
    }

    useEffect(() => {
        const loadClients = async () => {
            try {
                const data = await FetchClients()
                setClients(data)
            } catch (e) {
                setError((e as Error).message)
            } finally {
                setLoading(false)
            }
        }
        loadClients()
    }, [])



    if (loading) return <div>loading...</div>
    if (error) return <div>{error}</div>

    return (
        <>
            <ClientTable clients={clients} onSelectClient={handSelectClient} />
            <Drawer open={drawerOpen} onClose={handleCloseDrawer}>
                {selectdClient && (
                    <div>
                        <p>{selectdClient.name}</p>
                        <p>{selectdClient.email}</p>
                    </div>
                )}
            </Drawer>
        </>
    )
}