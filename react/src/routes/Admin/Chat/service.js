import axios from 'axios';
import {message} from "antd";
import routerLinks from "../../../utils/routerLinks";

export const GetUserChat = async (payload) => {
  const {data} = await axios.get('/users.list?count=10&offset=1');
  if (data.message) message.success(data.message);
  return data.data;
};
