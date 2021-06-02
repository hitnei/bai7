import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import i18n from "i18next";
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";
import axios from 'axios';
import { message } from 'antd';

import Router from './routes';
import AuthProvider from './global';
import routerLinks from "./utils/routerLinks";
import Loading from "./components/Loading";

import 'antd/dist/antd.css';
import 'line-awesome/dist/line-awesome/css/line-awesome.css';
import './assets/styles/index.scss';

axios.defaults.baseURL = 'http://localhost:3000/api/v1';
axios.interceptors.response.use((response) => response, (error) => {
  if ((!!error.response.data.errors && error.response.data.errors === 401) || error.response.status === 401) {
    window.location.hash = '#' + routerLinks('Login');
  }
  message.error(error.response.data.message);
  return Promise.reject(error);
});

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    fallbackLng: "en",
    whitelist: ["en","vi","ja"],
    interpolation: {
      escapeValue: false
    }
  });

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Suspense>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));

