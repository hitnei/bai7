import React, { useEffect, useState } from "react";
import {Card, Spin} from 'antd';

import {useTranslation} from "react-i18next";
import Form from "../../../components/Form";
import {useAuth} from "../../../global";
import {Get, Put} from "./service";

export default () => {
  const langPrefix = 'routes.Admin.Website.';
  const [columns] = useState([]);
  const [values] = useState({});
  const [settings, setSettings] = useState(null);
  const { t } = useTranslation();
  const auth = useAuth();

  const handSubmit = async (values) => {
    const data = settings.map(item => {
      item.value = values[item.name];
      return item;
    });
    await Put(data);
    auth.user.setting = values;
    auth.login(auth.user);
  };

  useEffect(async () => {
    const settings = await Get();
    settings.map(({title, name, type, value}) => {
      columns.push({title: t(langPrefix + title), name, formItem: {type}});
      values[name] = value;
      return null;
    });
    setSettings(settings);
  }, []);

  return (
    <Card title={t('titles.Website')}>
      {!!settings ? (
        <Form
          columns={columns}
          values={values}
          loading={false}
          handSubmit={handSubmit}
          textSubmit="Submit"
        />
      ): <div className="text-center"><Spin /></div>}

    </Card>
  );
};
