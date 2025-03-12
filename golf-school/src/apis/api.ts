import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios"

const baseURL = "https://api.golf-school.net/"
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
    if (axiosError.response?.status == 502) {
      alert("서버 오류 발생. 잠시 후 다시 시도해주세요.")
    } else if (axiosError.response?.data?.message) {
      alert(axiosError.response.data.message);
      return;
    }
  }
  alert("예상치 못한 오류가 발생했습니다.");
}

export const callHandlingErrorApi:AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
callHandlingErrorApi.interceptors.response.use(
  (response)=>response,
  (error)=>{
    handleApiError(error);
    return Promise.resolve(null);
  }
)
export const callNoneHandlingErrorApi:AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})
callNoneHandlingErrorApi.interceptors.response.use(
  (response)=>response,
  (error)=>{
    return Promise.resolve(null);
  }
)
export const callNoneCredentialApi:AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})