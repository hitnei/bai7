import axios from 'axios';
import routerLinks from "../../../utils/routerLinks";

export async function login_User(payload) {
  const { data } = await axios.get(routerLinks('Profile', 'api'), { params: payload });
  return data;
}
