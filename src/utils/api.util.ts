import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3003/api';
export const BUCKET_URL = 'https://elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com/cloverhapp';
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default instance;

export const fetcher = async (url: string) => {
  return await instance.get(url).then((res) => res.data);
};
