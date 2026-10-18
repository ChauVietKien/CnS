import axios from "axios"
import { axiosClient } from "./axiosClient"

export const createPost = async (data: FormData) => {
    const res = await axiosClient.post(`${process.env.NEXT_PUBLIC_API_URL}/tutor-post/create`, data, {
        withCredentials: true,
    });
    return res.data
}

export const getPost = async (id: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tutor-post/get-post/${id}`);
    return res.data
}

export const getAllPosts = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tutor-post/get-all-posts`);
    return res.data
}

export const getPostsByUser = async (userId: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tutor-post/get-posts-by-user/${userId}`);
    return res.data
}

export const updatePost = async (id: string, data: {}) => {
    const res = await axiosClient.put(`${process.env.NEXT_PUBLIC_API_URL}/tutor-post/update-post/${id}`, data, {
        withCredentials: true,
    });
    return res.data
}

export const deletePost = async (id: string) => {
    const res = await axiosClient.delete(`${process.env.NEXT_PUBLIC_API_URL}/tutor-post/delete-post/${id}`, {
        withCredentials: true,
    });
    return res.data
}

export const updatePostStatus = async (id: string, data: { status: string }) => {
    const res = await axiosClient.put(`${process.env.NEXT_PUBLIC_API_URL}/tutor-post/update-status/${id}`, data, {
        withCredentials: true,
    });
    return res.data
}
