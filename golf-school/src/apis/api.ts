import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios"

const baseURL = "https://golf-school.net/api/"
export const callApi: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
export function handleApiError(error:unknown):void {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    if (axiosError.response?.data?.message) {
      alert(axiosError.response.data.message);
      return;
    }
  }
  alert("예상치 못한 오류가 발생했습니다.");
}