import React from 'react';
import {Modal} from 'antd';

import DataTable from "../DataTable";

export default ({title, visible, handleCancel, ...propForm}) => {
  return (
    <Modal
      confirmLoading={propForm.loading}
      width={800}
      title={title}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      centered={true}
    >
      <DataTable {...propForm} save={false} />
    </Modal>
  );
};
