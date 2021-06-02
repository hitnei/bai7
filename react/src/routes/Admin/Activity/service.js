import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";

export const Get = async (params) => {
  const {data} = await axios.get(routerLinks("Activity", "api"), {params});
  return data;
};
export const Post = async (payload) => {
  const {data} = await axios.post(routerLinks("Activity", "api"), payload);
  if (data.message) message.success(data.message);
  return data;
};
export const Put = async (payload) => {
  const {data} = await axios.put(routerLinks("Activity", "api") + '/' + payload.id, payload);
  if (data.message) message.success(data.message);
  return data;
};
export const Delete = async (payload) => {
  for (let index = 0; index < payload.length; index++) {
    const id = payload[index];
    const {data} = await axios.delete(routerLinks("Activity", "api") + '/' + id);
    if (data.message) message.success(data.message);
  }
  return null;
};
export const Patch = async (payload) => {
  for (let index = 0; index < payload.length; index++) {
    const {data} = await axios.patch(routerLinks("Activity", "api") + '/' + payload[index].id, payload[index]);
    if (data.message) message.success(data.message);
  }
  return null;
};
