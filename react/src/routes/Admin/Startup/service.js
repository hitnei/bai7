import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";
import {handGetParent, handPostParent} from "../../../utils/core";

export const GetStartup = async (params) => {
  const {data} = await axios.get(routerLinks("Startup", "api"), {params});
  return data;
};
export const PostStartup = async (values) => {
  const {data} = await axios.post(routerLinks("Startup", "api"), values);
  if (data.message) message.success(data.message);
  return data;
};
export const PutStartup = async (values, id) => {
  const {data} = await axios.put(routerLinks("Startup", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
  return data;
};
export const DeleteStartup = async (id) => {
  const {data} = await axios.delete(routerLinks("Startup", "api") + '/' + id);
  if (data.message) message.success(data.message);
  return null;
};
export const PatchStartup = async (values, id) => {
  const {data} = await axios.patch(routerLinks("Startup", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
};
export const GetStartupCategory = async () => handGetParent(routerLinks("StartupCategory", "api") + "/");
export const PutStartupCategory = async (payload) => handPostParent(routerLinks("StartupCategory", "api")+'/', payload);
