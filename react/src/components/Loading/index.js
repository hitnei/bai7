import React from 'react';
import {Spin} from "antd";
import './index.scss';

export default () => {
  return (
    <div className="loading-page">
      <Spin size="large" tip="Loading..."/>
    </div>
  );
};
