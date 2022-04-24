import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/IActivity';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve,delay)
    })
}

axios.defaults.baseURL = 'http://127.0.0.1:5100/api/';

axios.interceptors.response.use(response => {
    return sleep(2000).then(() => {
        return response;
    }).catch((error => {
        console.log(error);
        return Promise.reject(error)
    }))
})

const responseBody = <T>  (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url:string) => axios.get<T>(url).then(responseBody),
    post: <T> (url:string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put:  <T> (url:string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete:  <T> (url:string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<IActivity[]>('/activities'),
    details: (id: string) => requests.get<IActivity>(`/activities/${id}`),
    create: (activity: IActivity) => axios.post('/activities', activity),
    update: (activity: IActivity) => axios.put(`activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete(`/activities/${id}`)

}

const agent = {
    Activities
}

export default agent;