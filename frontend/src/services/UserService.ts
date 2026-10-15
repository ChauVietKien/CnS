import axios from "axios"
import { axiosClient } from "./axiosClient"

export const createUser = async (data: { email: string, password: string }) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/sign-up`, data, {
        withCredentials: true
    })
    return res.data
}

export const loginUser = async (data: { email: string, password: string }) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/sign-in`, data, {
        withCredentials: true,
    });
    return res.data
}

export const updateUser = async ( id : string, data: {}) => {
    const res = await axiosClient.put(`${process.env.NEXT_PUBLIC_API_URL}/user/update-user/${id}`, data, {
        withCredentials: true,
    });
    return res.data
}

export const getDetailUser = async ( id : string) => {
    const res = await axiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/user/get-detail-user/${id}`);
    return res.data
}

export const deleteUser = async ( id: string) => {
    const res = await axiosClient.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/delete-user/${id}`)
    return res.data
}

export const getAllUser = async () => {
    const res = await axiosClient.get(`${process.env.NEXT_PUBLIC_API_URL}/user/get-all-users`);
    return res.data
}

export const refreshToken = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`, {}, {
        withCredentials: true,
    })
    return res.data
}

export const logoutUser = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/log-out`, {}, {
        withCredentials: true,
    })
    return res.data
}