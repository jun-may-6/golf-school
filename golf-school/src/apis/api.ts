import axios, { AxiosInstance, AxiosResponse } from "axios"

const baseURL = "https://z9m2acdblb.execute-api.ap-northeast-2.amazonaws.com/api/"
export const callApi: AxiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
