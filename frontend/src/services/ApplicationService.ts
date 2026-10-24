import { axiosClient } from "./axiosClient";

export const createApplication = async (data: {
  postId: string;
  name: string;
  email: string;
  className: string;
  phone: string;
  note: string;
}) => {
  const res = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/application/create`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const getApplication = async (id: string) => {
  const res = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/application/get-application/${id}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const getAllApplications = async (status?: string) => {
  const query = status ? `?status=${status}` : "";
  const res = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/application/get-all-applications${query}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const getApplicationsByUser = async (userId: string) => {
  const res = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/application/get-applications-by-user/${userId}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const updateApplicationStatus = async (
  id: string,
  data: { status: string },
) => {
  const res = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/application/update-status/${id}`,
    data,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const deleteApplication = async (id: string) => {
  const res = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/application/delete-application/${id}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
};
