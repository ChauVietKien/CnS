import axios from "axios";
import { axiosClient } from "./axiosClient";

export interface CreateTutorData {
  userId: string;
  name: string;
  phone?: string;
  avatar?: string;
  imagebg?: string;
  description?: string;
}

export interface UpdateTutorData {
  name?: string;
  phone?: string;
  avatar?: string;
  imagebg?: string;
  description?: string;
}

export const createTutor = async (data: CreateTutorData) => {
  const res = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/tutor-profile/create`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const getTutorProfile = async (userId: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/tutor-profile/get-profile/${userId}`,
  );
  return res.data;
};

export const getAllTutors = async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/tutor-profile/get-all-tutors`,
  );
  return res.data;
};

export const updateTutorProfile = async (userId: string, data: UpdateTutorData) => {
  const res = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/tutor-profile/update-profile/${userId}`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const deleteTutorProfile = async (userId: string) => {
  const res = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/tutor-profile/delete-profile/${userId}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

