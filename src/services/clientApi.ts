import type { Client } from "../types/client";

export const FetchClients = (): Promise<Client[]> => {
  const shouldFail = Math.random() > 0.5;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Failed to load clients"));
        return;
      }

      resolve([
        { id: 1, name: "Alice", email: "alice@test.com" },
        { id: 2, name: "Bob", email: "bob@test.com" },
      ]);
    }, 1000);
  });
};
