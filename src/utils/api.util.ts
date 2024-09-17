import axios from 'axios';

export const BASE_URL = '/api';

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default instance;

export const fetcher = async (url: string) => {
  return await instance.get(url).then((res) => res.data);
};
