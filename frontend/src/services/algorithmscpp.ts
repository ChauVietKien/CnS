import axios from "axios";

export const getResSearch = async (names: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(names)}`,
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi search:", error);
    return [];
  }
};

export const getResFilter = async (params: URLSearchParams) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/filter-post`,
      { params },
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi search:", error);
    return [];
  }
};
