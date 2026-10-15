'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    id: string
    name: string
    email: string
    role: string
    age: string
}

interface UserContextType {
    user: User | null
    setUser: (user: User | null) =>void
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null)

    // Reload trang → đọc localStorage → khôi phục user
    useEffect(() => {
        const saved = localStorage.getItem('user')
        if (saved) setUserState(JSON.parse(saved))
    }, [])

    // Wrapper: khi setUser → lưu cả vào localStorage
    const setUser = (user: User | null) => {
        setUserState(user)
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
            localStorage.removeItem('access_token')
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
