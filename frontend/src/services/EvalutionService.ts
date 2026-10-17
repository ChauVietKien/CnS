import axios from "axios"
import { axiosClient } from "./axiosClient"

export const createEvaluation = async (data: { tutorId: string, tutor_postId: string, rating: number, comment: string }) => {
    const res = await axiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}/evaluation/create`, data, {
        withCredentials: true,
    });
    return res.data
}

export const getEvaluation = async (id: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/evaluation/get-evaluation/${id}`);
    return res.data
}

export const getEvaluationsByTutor = async (tutorId: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/evaluation/get-by-tutor/${tutorId}`);
    return res.data
}

export const getEvaluationsByPost = async (postId: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/evaluation/get-by-post/${postId}`);
    return res.data
}

export const deleteEvaluation = async (id: string) => {
    const res = await axiosClient.delete(`${process.env.NEXT_PUBLIC_API_URL}/evaluation/delete-evaluation/${id}`, {
        withCredentials: true,
    });
    return res.data
}
