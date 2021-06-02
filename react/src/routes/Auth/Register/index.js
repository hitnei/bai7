import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {Link} from "react-router-dom";

import Form from "../../../components/Form";

import logo from '../../../assets/images/logo.png';
import { columns } from "./column";


export default (props) => {
  const langPrefix = 'routes.Auth.Register';
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const submit = (values) => {
    console.log(values);
  };


  return (
    <div className="container">
      <div className="text-center mb-50">
        <img src={logo} height="100" alt="" />
        <h3>{t(langPrefix + '.title')}</h3>
        <p><strong>{t(langPrefix + '.subTitle')}</strong></p>
      </div>
      <Form columns={columns({langPrefix, t})} loading={loading} textSubmit={t(langPrefix + '.signIn')} handSubmit={submit}/>

      <div className="text-center mt-30">
        <p>{t(langPrefix + '.haveAccount')} <Link to='/auth/login'>{t(langPrefix + '.signIn')}</Link></p>
      </div>
    </div>
  );
};
