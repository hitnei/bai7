import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";
import {handGetParent, handPostParent} from "../../../utils/core";

export const GetEvent = async (params) => {
  const {data} = await axios.get(routerLinks("Event", "api"), {params});
  return data;
};
export const PostEvent = async (values) => {
  const {data} = await axios.post(routerLinks("Event", "api"), values);
  if (data.message) message.success(data.message);
  return data;
};
export const PutEvent = async (values, id) => {
  const {data} = await axios.put(routerLinks("Event", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
  return data;
};
export const DeleteEvent = async (id) => {
  const {data} = await axios.delete(routerLinks("Event", "api") + '/' + id);
  if (data.message) message.success(data.message);
  return null;
};
export const PatchEvent = async (values, id) => {
  const {data} = await axios.patch(routerLinks("Event", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
};
export const GetEventCategory = async () => handGetParent(routerLinks("EventCategory", "api") + "/");
export const PutEventCategory = async (payload) => handPostParent(routerLinks("EventCategory", "api")+'/', payload);
