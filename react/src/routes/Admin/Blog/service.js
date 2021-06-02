import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";
import {handGetParent, handPostParent} from "../../../utils/core";

export const GetBlog = async (params) => {
  const {data} = await axios.get(routerLinks("Blog", "api"), {params});
  return data;
};
export const PostBlog = async (values) => {
  const {data} = await axios.post(routerLinks("Blog", "api"), values);
  if (data.message) message.success(data.message);
  return data;
};
export const PutBlog = async (values, id) => {
  const {data} = await axios.put(routerLinks("Blog", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
  return data;
};
export const DeleteBlog = async (id) => {
  const {data} = await axios.delete(routerLinks("Blog", "api") + '/' + id);
  if (data.message) message.success(data.message);
  return null;
};
export const PatchBlog = async (values, id) => {
  const {data} = await axios.patch(routerLinks("Blog", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
};
export const GetBlogCategory = async () => handGetParent(routerLinks("BlogCategory", "api") + "/");
export const PutBlogCategory = async (payload) => handPostParent(routerLinks("BlogCategory", "api")+'/', payload);
