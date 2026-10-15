import axios from "axios";
import { jwtDecode } from 'jwt-decode'
import { refreshToken } from "./UserService"

export const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

let refreshPromise: Promise<string | null> | null = null;

const getrefreshToken = async () => {
    try {
        const res = await refreshToken();
        return res?.access_token;
    } catch (e) {
        return null;
    }
}

axiosClient.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('access_token');

        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                const now = Date.now() / 1000;

                if (decoded?.exp && decoded?.exp < now + 15) {
                    if (!refreshPromise) {
                        refreshPromise = getrefreshToken().then((newToken) => {
                            refreshPromise = null;
                            if (newToken) {
                                localStorage.setItem('access_token', newToken);
                            } else {
                                localStorage.removeItem('access_token');
                                if (typeof window !== 'undefined') window.location.href = '/sign-in';
                            }
                            return newToken;
                        })
                    }
                    token = await refreshPromise;
                }
            } catch (e) {

            }
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    }, (error) => Promise.reject(error)
);

