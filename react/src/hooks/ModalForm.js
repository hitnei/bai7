import React, { useState } from "react";
import ModalForm from "../components/ModalForm";

export default ({ title, isLoading, setIsLoading, columns, handleChange, Post, Put, Patch, Delete, firstRun }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState(null);
  const handleCancel = () => {
    setIsVisible(false);
    setData(null);
  };
  const handleOk = async (values) => {
    setIsLoading(true);
    if (!data || !data.id) {
      await Post(values);
    } else {
      await Put(values, data.id);
    }
    setIsVisible(false);
    setData(null);
    await handleChange();
  };

  const handleEdit = async (item) => {
    firstRun && await firstRun();
    setData(item);
    setIsVisible(true);
  };

  const handlePatch = async (values, id) => {
    await Patch(values, id);
    await handleChange();
  };
  const handleDelete = async (id) => {
    await Delete(id);
    await handleChange();
  };

  return [handleEdit, handlePatch, handleDelete,
    () => <ModalForm
      title={title(data)}
      visible={isVisible}
      handleCancel={handleCancel}
      handleOk={handleOk}
      loading={isLoading}
      columns={columns}
      col={2}
      widthLabel={'130px'}
      values={data}
    />
  ];
};
