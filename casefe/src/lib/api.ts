import axios from "axios";


export const setBaseURL = (appWithoutApi: boolean) => {
  if(appWithoutApi) {
      instance.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL_WITHOUT_APP ;
  } else {
      instance.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  }
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const loginInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_FILE_URL,
  headers: {
    "Content-Type": "www-form-urlencoded",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZTE3OWNjYi0wYWJmLTQwOTYtOTVmYi0wOGRkODE2NjQ2NGUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoic3RyaW5nQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InN0cmluZ0BnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImNlMTc5Y2NiLTBhYmYtNDA5Ni05NWZiLTA4ZGQ4MTY2NDY0ZSIsImp0aSI6ImVlM2U1Mjk5LWMyYjctNGFiOS04Y2IzLWI0NWRhZmQ4ZTljNSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlRyYXZlbCBBZ2VudCIsImV4cCI6MTc0NTkzMzU5NywiaXNzIjoiUmF0bmFuYWdhckFwaSIsImF1ZCI6IlJhdG5hbmFnYXJBcGkifQ.8Wap4t4hH_yP550CAg6vv5MtJU_37R-YfB20V25iQFE";
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;

export const formDataConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
