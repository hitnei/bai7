import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";

export const Put = async (payload) => {
  const {data} = await axios.put(routerLinks("Profile", "api") + '/' + payload.id, payload);
  if (data.message) message.success(data.message);
  return data.data;
};
