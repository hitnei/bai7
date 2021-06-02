import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";
import {handGetParent, handPostParent} from "../../../utils/core";

export const GetMember = async (params) => {
  const {data} = await axios.get(routerLinks("Member", "api"), {params});
  return data;
};
export const PostMember = async (values) => {
  const {data} = await axios.post(routerLinks("Member", "api"), values);
  if (data.message) message.success(data.message);
  return data;
};
export const PutMember = async (values, id) => {
  const {data} = await axios.put(routerLinks("Member", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
  return data;
};
export const DeleteMember = async (id) => {
  const {data} = await axios.delete(routerLinks("Member", "api") + '/' + id);
  if (data.message) message.success(data.message);
  return null;
};
export const PatchMember = async (values, id) => {
  const {data} = await axios.patch(routerLinks("Member", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
};
export const GetMemberCategory = async () => handGetParent(routerLinks("MemberCategory", "api") + "/");
export const PutMemberCategory = async (payload) => handPostParent(routerLinks("MemberCategory", "api")+'/', payload);
