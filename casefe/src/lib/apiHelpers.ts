import type { AxiosRequestConfig } from "axios";
import instance, { loginInstance } from "./api";
import { setBaseURL } from "./api";
export const getData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
  appWithoutApi?: boolean,
) => {
  try {
    setBaseURL(appWithoutApi ?? false);
    const res = await instance.get<T>(url, config);
    return res.data;
  } catch (error) {
    console.error("Error in getData:", error);
    throw error;
  }
};

export const postData = async <Payload, Response>(
  url: string,
  data: Payload,
  config?: AxiosRequestConfig,
): Promise<Response> => {
  try {
    console.log(url);
    const res = url.includes("token")
      ? await loginInstance.post<Response>(url, data, config)
      : await instance.post<Response>(url, data, config);
    return res.data;
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

export const updateData = async <Payload, Response>(
  url: string,
  data: Payload,
  config?: AxiosRequestConfig,
): Promise<Response> => {
  try {
    const res = await instance.patch<Response>(url, data, config);
    return res.data;
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};

export const deleteData = async <Response>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<Response> => {
  try {
    const res = await instance.delete<Response>(url, config);
    return res.data;
  } catch (error) {
    console.error("Error in postData:", error);
    throw error;
  }
};
