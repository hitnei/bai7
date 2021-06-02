import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";
import {handGetParent, handPostParent} from "../../../utils/core";

export const Get = async (params) => {
  const {data} = await axios.get(routerLinks("Page", "api"), {params});
  return data;
};
export const Post = async (values) => {
  const {data} = await axios.post(routerLinks("Page", "api"), values);
  if (data.message) message.success(data.message);
  return data;
};
export const Put = async (values, id) => {
  const {data} = await axios.put(routerLinks("Page", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
  return data;
};
export const Delete = async (id) => {
  const {data} = await axios.delete(routerLinks("Page", "api") + '/' + id);
  if (data.message) message.success(data.message);
  return null;
};
export const Patch = async (values, id) => {
  const {data} = await axios.patch(routerLinks("Page", "api") + '/' + id, values);
  if (data.message) message.success(data.message);
};
export const GetMenu = async () => handGetParent(routerLinks("PageMenu", "api") + "/");
export const PutMenu = async (payload) => handPostParent(routerLinks("PageMenu", "api")+'/', payload);
export const DeleteMenu = async (id) => {
  const {data} = await axios.delete(routerLinks("PageMenu", "api") + '/' + id);
  if (data.message) message.success(data.message);
};

export const GetSlideshow = async () => handGetParent(routerLinks("PageSlideshow", "api") + "/");
export const PutSlideshow = async (payload) => handPostParent(routerLinks("PageSlideshow", "api")+'/', payload);
export const DeleteSlideshow = async (id) => {
  const {data} = await axios.delete(routerLinks("PageSlideshow", "api") + '/' + id);
  if (data.message) message.success(data.message);
};

export const GetBrand = async () => handGetParent(routerLinks("Brand", "api") + "/");
export const PutBrand = async (payload) => handPostParent(routerLinks("Brand", "api")+'/', payload);
export const DeleteBrand = async (id) => {
  const {data} = await axios.delete(routerLinks("Brand", "api") + '/' + id);
  if (data.message) message.success(data.message);
};
