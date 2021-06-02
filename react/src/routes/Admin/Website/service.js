import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";

export const Get = async () => {
  const {data} = await axios.get(routerLinks("Website", "api"));
  return data;
};

export const Put = async (payload) => {
  const {data} = await axios.put(routerLinks("Website", "api") + "/all", payload);
  if (data.message) message.success(data.message);
  return data.data;
};
