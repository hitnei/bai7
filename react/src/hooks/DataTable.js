import React, { useState } from "react";
import DataTable from "../components/DataTable";

export default ({isLoading, setIsLoading, columns, leftHeader, rightHeader, Get}) => {
  const [params, setParams] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [totalData, setTotalData] = useState(true);

  const handleChange = async (request = null) => {
    if (request) {
      setParams(request);
    }
    setIsLoading(true);
    const {data, total} = await Get(request || params);
    setIsLoading(false);
    setTotalData(total);
    setDataSource(data);
  };

  return [
    handleChange,
    () => <DataTable
      leftHeader={leftHeader}
      rightHeader={rightHeader}
      loading={isLoading}
      columns={columns}
      dataSource={dataSource}
      onChange={handleChange}
      total={totalData}
    />
  ];
};
