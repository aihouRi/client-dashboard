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

    const [form, setForm] = useState({
        name: "",
        email: ""
    })

    const [isSaving, setIsSaving] = useState(false)

    type ViewMode = "view" | "edit" | "create" | null

    const [mode, setmode] = useState<ViewMode>(null)

    const handSelectClient = (client: Client) => {
        setselectedClients(client)
        setmode("view")
        setDraweropen(true)
    }

    const handleCloseDrawer = () => {
        setDraweropen(false)
        setmode(null)
        resetEditingState()
    }

    const resetEditingState = () => {
        setmode("view")
        setForm({ name: "", email: "" })
    }

    const createModeCancel = () => {
        setmode(null)
        setForm({ name: "", email: "" })
        setDraweropen(false)
    }

    const handleEdit = () => {
        setmode("edit")
        if (!selectdClient) return
        setForm({
            name: selectdClient.name,
            email: selectdClient.email
        })
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

    const handleDelete = () => {
        if (!selectdClient) return
        setClients(prev => prev.filter(c => c.id !== selectdClient.id))
        handleCloseDrawer()
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
                {mode === "view" && selectdClient && (
                    <div>
                        <p>{selectdClient.name}</p>
                        <p>{selectdClient.email}</p>
                        <button onClick={handleEdit}>Edit</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )}


                {(mode === "create" || mode === "edit") && (
                    <>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        <button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        {mode === "create" ? (<button onClick={createModeCancel} disabled={isSaving}>Cancel</button>) : (<button onClick={resetEditingState} disabled={isSaving}>Cancel</button>)}
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