import React from 'react';
import {Layout, Select} from 'antd';
import {useTranslation} from "react-i18next";
import './index.scss';

export default ({children}) => {
  const { i18n } = useTranslation();

  return (
    <Layout className="auth">
      {children}
      <div className="text-center">
        <Select value={i18n.language} style={{width: 100}} onChange={(values) => i18n.changeLanguage(values)}>
          <Select.Option value="vi">Vietnam</Select.Option>
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="ja">Japan</Select.Option>
        </Select>
      </div>
    </Layout>
  );
};
