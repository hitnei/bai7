import React, {useState ,useEffect} from 'react';
import {Modal, Form as FormAnt} from 'antd';
import {useTranslation} from "react-i18next";

import Form from '../Form';

export default ({title, visible, handleOk, handleCancel, values, widthModal = 1200, ...propForm}) => {
  const { t } = useTranslation();
  const [form] = FormAnt.useForm();
  const [check, setCheck] = useState(false);

  const onOk = () => {
    form.validateFields().then((values => {
      return handleOk && handleOk(values);
    }));
  };

  const onCancel = () => {
    return handleCancel && handleCancel();
  };

  useEffect(() => {
    if (visible) {
      if (check) {
        form.resetFields();
      } else {
        setCheck(true);
      }
      if (!!values) {
        form.setFieldsValue(values);
      }
    }
  }, [visible]);

  return (
    <Modal
      confirmLoading={propForm.loading}
      width={widthModal}
      title={title}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={t('components.ModalForm.save')}
      cancelText={t('components.ModalForm.cancel')}
      centered={true}
    >
      <Form {...propForm} values={values} form={form}/>
    </Modal>
  );
};
