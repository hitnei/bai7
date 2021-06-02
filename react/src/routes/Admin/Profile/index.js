import React from "react";
import {Card } from 'antd';
import {Put} from './service';

import {columns} from "./column";
import {useTranslation} from "react-i18next";
import Form from "../../../components/Form";
import {useAuth} from "../../../global";


export default () => {
  const langPrefix = 'routes.Admin.Profile';
  const { t } = useTranslation();
  const auth = useAuth();

  const handSubmit = async (values) => {
    const user = await Put(values);
    user.remember = auth.user.remember;
    auth.login(user);
  };

  return (
    <Card title={t('titles.Profile')}>
      <Form
        columns={columns({langPrefix, t})}
        values={auth.user}
        loading={false}
        handSubmit={handSubmit}
        textSubmit={t(langPrefix + '.save')}
      />
    </Card>
  );
};
