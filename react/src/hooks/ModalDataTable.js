import React, { useState } from "react";
import ModalDataTable from "../components/ModalDataTable";

export default ({ title, isLoading, setIsLoading, columns, leftHeader, firstRun, Get}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [params, setParams] = useState({});
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [dataId, setDataId] = useState(null);
  const handleShow = async ({id}) => {
    setDataId(id);
    setIsLoading(true);
    await firstRun();
    await handleChange(id,{page: 1, per_page: 10, sorts: {}, filters: {}});
    setIsVisible(true);
    setIsLoading(false);
  };
  const handleChange = async (id, request) => {
    if (!id) {
      id = dataId;
    } else {
      setDataId(id);
    }
    if (request) {
      setParams(request);
    } else {
      request = params;
    }
    setIsLoading(true);
    const {data, total} = await Get(id, request);
    setIsLoading(false);
    setData(data);
    setTotalData(total);
  };

  return [
    handleShow,
    handleChange,
    () => <ModalDataTable
      title={title}
      loading={isLoading}
      visible={isVisible}
      handleCancel={() => setIsVisible(false)}
      leftHeader={leftHeader(dataId)}
      columns={columns}
      dataSource={data}
      total={totalData}
      onChange={handleChange}
    />
  ];
};
