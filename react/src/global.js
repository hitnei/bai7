import React, { useCallback, useContext, useEffect, useState } from 'react';
import {keyUser, rodeIdAdmin} from "./utils/variable";
import axios from "axios";
import {useTranslation} from "react-i18next";
import routerLinks from "./utils/routerLinks";


export const AuthContext = React.createContext({
  user: {},
  title: '',
  setTitlePage: () => { },
  login: () => { },
  logout: () => { }
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default ({children}) => {
  let [user, setUser] = useState(JSON.parse(localStorage.getItem(keyUser)));
  const [title, setTitle] = useState('');
  const { t } = useTranslation();

  const login = useCallback((data) => {
    user = data;
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    setUser({});
  }, []);

  const checkPermission = useCallback((url, method = "GET") => {
    const _permissions = {[routerLinks("Profile")]: ["GET"]};
    user.permissions.map((item) => _permissions[item.permission_route] = item.can);
    if (user.role_id !== rodeIdAdmin) {
      if (method === "ALL") return typeof _permissions[url] !== "undefined" && _permissions[url].length > 3;
      return typeof _permissions[url] !== "undefined" && _permissions[url].indexOf(method) > -1;
    }
    return true;
  }, []);

  const setTitlePage = useCallback((name) => {
    document.title = t(name);
    setTitle(name);
  }, []);


  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common['X-localization'] = localStorage.getItem('i18nextLng');
      axios.defaults.headers.common['Authorization'] = user.token;
      localStorage.setItem(keyUser, JSON.stringify(user));
    } else {
      window.location.hash = '#' + routerLinks('Login');
    }
  }, [user]);

  return <AuthContext.Provider
    value={{
      user,
      login,
      logout,
      title,
      setTitlePage,
      checkPermission,
    }}>
    {children}
  </AuthContext.Provider>;
};
