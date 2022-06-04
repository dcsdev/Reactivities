import axios, { AxiosError, AxiosResponse } from "axios";
import { request } from "http";
import { toast } from "react-toastify";
import { history } from "../..";
import { ActivityFormValues, IActivity } from "../models/IActivity";
import { User, UserFormValues } from "../models/IUser";
import { store } from "../stores/store";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://127.0.0.1:5100/api/";

axios.interceptors.request.use(config => {
  const token = store.commonStore.token;
  
  if(token) 
  {
    config.headers!.Authorization = `Bearer ${token}`
  }

  return config;
})

axios.interceptors.response.use(
  async (response) => {
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;

    switch (status) {
      case 400:
        if(typeof data === 'string') {
          toast.error(data);
        }
        if(config.method === 'get' && data.errors.hasOwnProperty('id')) {
          history.push('/not-found');
        }
          if (data.errors)  {
              const modelStateErrors = [];
              for(const key in data.errors) {
                  if (data.errors[key]) {
                      modelStateErrors.push(data.errors[key]);
                  }
              }
              throw modelStateErrors.flat();
          } else {
              toast.error(data);
          }
        toast.error("bad request");
        break;
      case 401:
        toast.error("unauthorized");
        break;
      case 404:
        history.push('/not-found');
        break;
      case 500:
        store.commonStore.setServerError(data);
        history.push('/server-error');
        toast.error("not found");
        break;
    }

    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
  
};

const Activities = {
  list: () => requests.get<IActivity[]>("/activities"),
  details: (id: string) => requests.get<IActivity>(`/activities/${id}`),
  create: (activity: ActivityFormValues) => axios.post("/activities", activity),
  update: (activity: ActivityFormValues) =>
    axios.put(`activities/${activity.id}`, activity),
  delete: (id: string) => axios.delete(`/activities/${id}`),
  attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
};

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
}

const agent = {
  Activities,
  Account
};

export default agent;
