import { useState } from "react"
import type { Client } from "../types/client"
import { ClientTable } from "../components/ClientTable"

export const ClientListContainer = () => {
    const [clients] = useState<Client[]>(
        [
            { id: 1, name: "Alice", email: "alice@test.com" },
            { id: 2, name: "Bob", email: "bob@test.com" }
        ]
    )
    return <ClientTable clients={clients} />
}