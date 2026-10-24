import axios from "axios"
import { axiosClient } from "./axiosClient"

export const createStudentProfile = async (data: { name: string; phone?: string }) => {
    const res = await axiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}/student-profile/create`, data, {
        withCredentials: true,
    });
    return res.data
}

export const getStudentProfile = async (userId: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student-profile/get-profile/${userId}`);
    return res.data
}

export const updateStudentProfile = async (userId: string, data: { name?: string; phone?: string }) => {
    const res = await axiosClient.put(`${process.env.NEXT_PUBLIC_API_URL}/student-profile/update-profile/${userId}`, data, {
        withCredentials: true,
    });
    return res.data
}

export const deleteStudentProfile = async (userId: string) => {
    const res = await axiosClient.delete(`${process.env.NEXT_PUBLIC_API_URL}/student-profile/delete-profile/${userId}`, {
        withCredentials: true,
    });
    return res.data
}
