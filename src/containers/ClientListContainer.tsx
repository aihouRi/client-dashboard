import { useEffect, useState } from "react"
import type { Client } from "../types/client"
import { ClientTable } from "../components/ClientTable"
import { FetchClients } from "../services/clientApi"
import { Button, Drawer } from "@mui/material"

export const ClientListContainer = () => {
    const [clients, setClients] = useState<Client[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectdClient, setselectedClients] = useState<Client | null>(null)
    const [drawerOpen, setDraweropen] = useState(false)

    const [isEditing, setEditing] = useState(false)
    const [form, setForm] = useState({
        name: "",
        email: ""
    })

    const [isSaving, setIsSaving] = useState(false)
    const [mode, setmode] = useState<"create" | "edit" | null>(null)

    const handSelectClient = (client: Client) => {
        setselectedClients(client)
        setDraweropen(true)
    }

    const handleCloseDrawer = () => {
        setDraweropen(false)
        setmode(null)
        resetEditingState()
    }

    const resetEditingState = () => {
        setEditing(false)
        setForm({ name: "", email: "" })
    }

    const handleEdit = () => {
        if (!selectdClient) return
        setForm({
            name: selectdClient.name,
            email: selectdClient.email
        })
        setEditing(true)
    }

    const handleSave = () => {
        setIsSaving(true)

        setTimeout(() => {
            if (mode === "edit" && selectdClient) {
                setClients(prev => prev.map(c => c.id === selectdClient.id ? { ...c, name: form.name, email: form.email } : c))
            }

            if (mode === "create") {
                const newClient = {
                    id: Date.now(),
                    name: form.name,
                    email: form.email
                }
                setClients(prev => [...prev, newClient])
            }

            setIsSaving(false)
            setEditing(false)
            setDraweropen(false)
            setForm({ name: "", email: "" })
        }, 1000);
    }

    const handleCreate = () => {
        setmode("create")
        setselectedClients(null)
        setForm({ name: "", email: "" })
        setDraweropen(true)
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
                {!isEditing && selectdClient && (
                    <div>
                        <p>{selectdClient.name}</p>
                        <p>{selectdClient.email}</p>
                        <button onClick={handleEdit}>Edit</button>
                    </div>
                )}


                {(mode === "create" || mode === "edit") && (
                    <>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        <button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button onClick={resetEditingState} disabled={isSaving}>Cancel</button>
                    </>
                )
                }
            </Drawer>
            <Button onClick={handleCreate}>
                + Create Client
            </Button>
        </>
    )
}