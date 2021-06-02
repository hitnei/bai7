import axios from 'axios';
import {message} from "antd";

export async function getList_MEDIA(path) {
  const { data } = await axios.get('/media', {params: { path } });
  return data;
}

export async function save_MEDIA(payload) {
  const { data } = await axios.post('/media', payload);
  if (data.message) message.success(data.message);
  return data;
}

export async function delete_MEDIA(params) {
  const {data} = await axios.delete('/media/id',{ params });
  if (data.message) message.success(data.message);
  return null;
}
