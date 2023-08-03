import React, { createContext } from "react";
import { useLocal } from "./lshooks";

export const UserHistory = createContext();

export function ContextProvider({ children }) {
    const [userHistory, setUserHistory] = useLocal("user-history", {})

    return (
        <UserHistory.Provider value={[userHistory, setUserHistory]}>
            {children}
        </UserHistory.Provider>
    )
}