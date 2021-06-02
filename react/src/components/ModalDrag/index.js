import React, {useState, Fragment} from 'react';
import {Button, Col, Modal, Popconfirm, Row, Tooltip, Drawer, Spin,Form as FormAnt} from 'antd';
import {useTranslation} from "react-i18next";
import { v4 } from "uuid";
import Nestable from "react-nestable";

import Form from '../Form';

import './index.scss';
import {useAuth} from "../../global";
import routerLinks from "../../utils/routerLinks";


export default ({
  title, visible, handleOk, handleCancel, items, onSave, loading, onShowModal, namePermission,
  readOnly = false, maxDepth = 3, ...propForm
}) => {
  const { t } = useTranslation();
  const {checkPermission} = useAuth();
  const langPrefix = 'components.ModalForm';
  const [data, setData] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [form] = FormAnt.useForm();

  let order = 0;

  const handChangeOrder = (items, item) => {
    order = 0;
    items = loop(items, 0, item);
    return onSave && onSave(items);
  };

  const loop = (array, parentId, item) => {
    for (let i = 0; i < array.length; i++) {
      order++;
      array[i]['order'] = order;
      array[i]['parent_id'] = parentId;
      if (array[i].children.length > 0) {
        array[i].children = loop(array[i].children, array[i].id, item);
      }
    }
    return array;
  };

  const handleSaveItem = (item, id) => {
    return onSave && onSave(findItemById(item, id, items));
  };

  const findItemById = (newItem, id, array) => {
    return array.map((item) => {
      if (item.id === id) {
        return newItem;
      } else if (item.children) {
        item.children = findItemById(newItem, id, item.children);
      }
      return item;
    });
  };

  const handleEdit = (item) => {
    setData(item);
    if (!!item) {
      form.setFieldsValue(item);
    } else {
      form.resetFields();
    }
    setIsVisible(true);
  };

  const handleSubmit = (values) => {
    if (data) {
      handleSaveItem({...data, ...values}, data.id);
    } else {
      const data = {...values, id: v4() + "-11c", children: []};
      items.push(data);
      onSave(items);
    }
    setIsVisible(false);
  };

  const handleDelete = (id) => {
    return onSave && onSave(deleteItem(items, id), id);
  };

  const deleteItem = (array, id) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === id) {
        array.splice(i, 1);
        i--;
      } else if (array[i].children) {
        array[i].children = deleteItem(array[i].children, id);
      }
    }
    return array;
  };

  return (
    <Fragment>
      <Modal
        confirmLoading={loading}
        width={800}
        title={title}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t(langPrefix + '.save')}
        cancelText={t(langPrefix + '.cancel')}
        centered={true}
        maskClosable={false}
      >
        <Spin spinning={loading}>
          {(!readOnly && checkPermission(routerLinks(namePermission,"api", "POST"))) && (
            <Tooltip title={"new"}>
              <Button type="primary" size="small" onClick={() => handleEdit(null)} icon={<i className="las la-plus" />} />
            </Tooltip>
          )}
          <Nestable
            className="mt-10"
            maxDepth={maxDepth}
            items={items}
            collapsed={true}
            onChange={handChangeOrder}
            renderItem={({ item, collapseIcon }) => (
              <Row className="item-drag" align="middle" justify="space-between">
                <Col flex="auto">{collapseIcon}{!!item.title ? item.title : item.name}</Col>
                {!readOnly && (
                  <Col flex={(typeof onShowModal !== "undefined" ? 110 : 80)+"px"}>
                    <Button.Group>
                      {checkPermission(routerLinks(namePermission,"api", "PUT")) && (
                        <Tooltip title={t('routes.Admin.User.status')}>
                          <Button
                            size="small"
                            type={item.status === 0 ? "primary" : ""}
                            danger={item.status === 0}
                            icon={<i className={`las ${ item.status === 0 ? "la-low-vision" : "la-eye"}`} />}
                            onClick={() => handleSaveItem({...item, status:  item.status === 1 ? 0 : 1}, item.id)}
                          />
                        </Tooltip>
                      )}
                      {/*<Tooltip title={"featured"}>*/}
                      {/*  <Button*/}
                      {/*    size="small"*/}
                      {/*    type={item.featured === 1 ? "primary" : ""}*/}
                      {/*    icon={<i className="las la-award" />}*/}
                      {/*    onClick={() => handleSaveItem({...item, featured:  item.featured === 1 ? 0 : 1}, item.id)}*/}
                      {/*  />*/}
                      {/*</Tooltip>*/}
                      {typeof onShowModal !== "undefined" && (
                        <Tooltip title={t('components.MediaManagement.detail')}>
                          <Button
                            size="small"
                            icon={<i className="las la-sitemap" />}
                            onClick={() => onShowModal(item)}
                          />
                        </Tooltip>
                      )}
                      {checkPermission(routerLinks(namePermission,"api", "PUT")) && (
                        <Tooltip title={t('routes.Admin.User.edit')}>
                          <Button
                            size="small"
                            icon={<i className="las la-edit" />}
                            onClick={() => handleEdit(item)}
                          />
                        </Tooltip>
                      )}
                      {checkPermission(routerLinks(namePermission,"api", "DELETE")) && (
                        <Popconfirm
                          title={t('components.Datatable.areYouSureWant')}
                          icon={<i className="las la-question-circle" />}
                          onConfirm={() => handleDelete(item.id)}
                        >
                          <Tooltip title={t('routes.Admin.User.delete')}>
                            <Button
                              size="small"
                              type="primary"
                              icon={<i className="las la-trash-alt" />}
                              danger={true} />
                          </Tooltip>
                        </Popconfirm>
                      )}
                    </Button.Group>
                  </Col>
                )}
              </Row>
            )}
          />
        </Spin>
      </Modal>
      <Drawer
        title={data ? t('routes.Admin.User.edit') : t('routes.Admin.User.addNew')}
        placement="right"
        onClose={() => setIsVisible(false)}
        visible={isVisible}
      >
        <Form {...propForm} values={data} form={form} handSubmit={handleSubmit} textSubmit={t('components.ModalForm.save')}/>
      </Drawer>
    </Fragment>
  );
};
