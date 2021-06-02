import React, {useEffect, useState} from "react";
import ModalDrag from "../components/ModalDrag";

export default ({title, isLoading, setIsLoading, columns, Get, Put, handleShowModal, namePermission}) => {
  const [items, setItems] = useState([]);
  const [deleteItems, setDeleteItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(async () => {
    if (isVisible) {
      setIsLoading(true);
      const data = await Get();
      setItems(data);
      setDeleteItems([]);
      setIsLoading(false);
    }
  }, [isVisible]);

  const handleShow = () => setIsVisible(true);
  const handleOk = async () => {
    await Put({data: items, requestDelete: deleteItems});
    setIsVisible(false);
  };
  const handleSave = (data, id = null) => {
    setIsLoading(true);
    setItems(data);
    if (id && id.length === 36) {
      deleteItems.push(id);
    }
    setTimeout(() => {setIsLoading(false);});
  };

  return [
    handleShow,
    () => <ModalDrag
      title={title}
      visible={isVisible}
      handleCancel={() => setIsVisible(false)}
      handleOk={handleOk}
      loading={isLoading}
      items={items}
      onSave={handleSave}
      columns={columns}
      onShowModal={handleShowModal}
      namePermission={namePermission}
    />
  ];
};
