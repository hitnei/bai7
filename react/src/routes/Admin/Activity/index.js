import React, { useState, Fragment } from "react";
import {useTranslation} from "react-i18next";

import DataTable from "../../../components/DataTable";

import {columns} from "./column";
import {Get} from "./service";

export default () => {
  const langPrefix = 'routes.Admin.Activity';
  const { t } = useTranslation();

  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const onChange = async (params) => {
    setIsLoading(true);
    const {data} = await Get(params);
    setIsLoading(false);
    setDataSource(data);
  };

  return (
    <DataTable columns={columns({langPrefix, t})} loading={isLoading} dataSource={dataSource} onChange={onChange}/>
  );
};
