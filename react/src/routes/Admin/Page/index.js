import React, { useState, useEffect, Fragment } from "react";
import {Button, Space} from 'antd';

import {columns, columnsMenu, columnsSlideshow, columnsBrand} from "./column";
import {useTranslation} from "react-i18next";
import {Get, Post, Put, Delete, Patch, GetMenu, PutMenu, GetSlideshow,PutSlideshow,GetBrand,PutBrand} from "./service";
import HookModalForm from "../../../hooks/ModalForm";
import routerLinks from "../../../utils/routerLinks";
import HookModalDrag from "../../../hooks/ModalDrag";
import HookDataTable from "../../../hooks/DataTable";
import {useAuth} from "../../../global";

export default () => {
  const { t } = useTranslation();
  const {checkPermission} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  useEffect(async () => {
    if (checkPermission(routerLinks("PageMenu", "api"))) {
      const _data = await GetMenu();
      setMenus(_data.map(item => ({value: item.id, label: item.name})));
    }
  }, []);

  const [handleEdit, handlePatch, handleDelete, ModalForm] = HookModalForm({
    title: (data) => !data?.id ? t('routes.Admin.User.addNew') : t('routes.Admin.User.edit'),
    isLoading, setIsLoading,
    handleChange: async () => {
      return await handleChange();
    },
    columns: columns({
      t, menus,
    }),
    Post, Put, Patch, Delete,
    firstRun: async () => {
      if (checkPermission(routerLinks("PageMenu", "api"))) {
        const _data = await GetMenu();
        setMenus(_data.map(item => ({value: item.id, label: item.name})));
      }
    }
  });

  const [handleShowDrag, ModalDrag] = HookModalDrag({
    title: t('routes.Admin.Page.Menu'),
    isLoading, setIsLoading,
    columns: columnsMenu({t}),
    Get: GetMenu,
    Put: PutMenu,
    namePermission: "PageMenu",
  });

  const [handleShowDragSlideshow, ModalDragSlideshow] = HookModalDrag({
    title: t('routes.Admin.Page.Slideshow'),
    isLoading, setIsLoading,
    columns: columnsSlideshow({t}),
    Get: GetSlideshow,
    Put: PutSlideshow,
    namePermission: "PageSlideshow",
  });

  const [handleShowDragBrand, ModalDragBrand] = HookModalDrag({
    title: t('routes.Admin.Brand.Title'),
    isLoading, setIsLoading,
    columns: columnsBrand({t}),
    Get: GetBrand,
    Put: PutBrand,
    namePermission: "Brand",
  });


  const [handleChange, DataTable] = HookDataTable({
    isLoading, setIsLoading, Get,
    columns: columns({t, menus, handleEdit, handleDelete, handlePatch, checkPermission}),
    leftHeader: (
      <Space>
        {checkPermission(routerLinks("Page", "api"), "POST") && (
          <Button type="primary" onClick={() => handleEdit()}>
            <i className="las la-plus la-lg mr-5"/>
            {t('routes.Admin.User.addNew')}
          </Button>
        )}
        {checkPermission(routerLinks("PageMenu", "api")) && (
          <Button type="primary" onClick={handleShowDrag}>
            <i className="las la-bars la-lg mr-5"/>
            {t('routes.Admin.Page.Menu')}
          </Button>
        )}
        {checkPermission(routerLinks("PageSlideshow", "api")) && (
          <Button type="primary" onClick={handleShowDragSlideshow}>
            <i className="las la-images la-lg mr-5"/>
            {t('routes.Admin.Page.Slideshow')}
          </Button>
        )}
        {checkPermission(routerLinks("Brand", "api")) && (
          <Button type="primary" onClick={handleShowDragBrand}>
            <i className="las la-industry la-lg mr-5"/>
            {t('routes.Admin.Brand.Title')}
          </Button>
        )}
      </Space>
    )
  });

  return (
    <Fragment>
      {ModalDrag()}
      {ModalDragSlideshow()}
      {ModalDragBrand()}
      {ModalForm()}
      {DataTable()}
    </Fragment>
  );
};
