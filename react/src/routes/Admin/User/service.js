import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";
import {handGetParent, handPostParent} from "../../../utils/core";

export const GetUser = async (params) => {
  const {data} = await axios.get(routerLinks("User", "api"), {params});
  return data;
};
export const PostUser = async (values) => {
  const {data} = await axios.post(routerLinks("User", "api"), values);
  if (data.message) message.success(data.message);
  return data;
};
export const PutUser = async (values, id) => {
  const {data} = await axios.put(routerLinks("User", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
  return data;
};
export const DeleteUser = async (id) => {
  const {data} = await axios.delete(routerLinks("User", "api") + '/' + id);
  if (data.message) message.success(data.message);
  return null;
};
export const PatchUser = async (values, id) => {
  const {data} = await axios.patch(routerLinks("User", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
};
export const GetRole = async () => handGetParent(routerLinks("Role", "api") + "/");
export const PutRole = async (payload) => handPostParent(routerLinks("Role", "api")+'/', payload);
export const GetRolePermission = async (id, params) => {
  const {data} = await axios.get(routerLinks("RolePermission", "api") + '/' + id, {params});
  return data;
};
export const PostRolePermission = async (values) => {
  const {data} = await axios.post(routerLinks("RolePermission", "api"), values);
  if (data.message) message.success(data.message);
  return data;
};
export const PutRolePermission = async (values, id) => {
  const {data} = await axios.put(routerLinks("RolePermission", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
  return data;
};
export const DeleteRolePermission = async (id) => {
  const {data} = await axios.delete(routerLinks("RolePermission", "api") + '/' + id);
  if (data.message) message.success(data.message);
  return null;
};
export const PatchRolePermission = async (values, id) => {
  const {data} = await axios.patch(routerLinks("RolePermission", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
};

export const GetPermission = async () => handGetParent(routerLinks("Permission", "api") + "/");

export const check_slug = async (obj) => {
  const {data} = await axios.post(routerLinks("CheckSlug", "api"), obj);
  return data.data;
};
