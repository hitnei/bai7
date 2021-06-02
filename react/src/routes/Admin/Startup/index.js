import React, { useState, Fragment, useEffect } from "react";
import {Button, Space} from 'antd';

import HookDataTable from "../../../hooks/DataTable";
import HookModalForm from "../../../hooks/ModalForm";
import HookModalDrag from "../../../hooks/ModalDrag";

import {
  columnsStartup,
  columnsStartupCategory,
} from "./column";
import {useTranslation} from "react-i18next";
import {
  GetStartup, PostStartup, PutStartup, DeleteStartup, PatchStartup,
  GetStartupCategory, PutStartupCategory,
} from "./service.js";
import {useAuth} from "../../../global";
import routerLinks from "../../../utils/routerLinks";

export default () => {
  const { t } = useTranslation();
  const {checkPermission} = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [startupCategorys, setStartupCategorys] = useState([]);
  useEffect(async () => {
    if (checkPermission(routerLinks("StartupCategory", "api"))) {
      const _data = await GetStartupCategory();
      setStartupCategorys(_data);
    }
  }, []);

  const [handleEditStartup, handlePatchStartup, handleDeleteStartup, ModalFormStartup] = HookModalForm({
    title: (data) => !data?.id ? t('routes.Admin.User.addNew') : t('routes.Admin.User.edit'),
    isLoading, setIsLoading,
    handleChange: async () => {
      return await handleChange();
    },
    columns: columnsStartup({
      t,
      startupCategorys: startupCategorys
    }),
    Post: PostStartup,
    Put: PutStartup,
    Patch: PatchStartup,
    Delete: DeleteStartup,
    firstRun: async () => {
      if (checkPermission(routerLinks("StartupCategory", "api"))) {
        const _data = await GetStartupCategory();
        setStartupCategorys(_data);
      }
    }
  });
  const [handleShowDragStartupCategory, ModalDragStartupCategory] = HookModalDrag({
    title: t('routes.Admin.Startup.StartupCategory'),
    isLoading, setIsLoading,
    columns: columnsStartupCategory({t}),
    Get: GetStartupCategory,
    Put: PutStartupCategory,
    namePermission: "StartupCategory",
  });

  const [handleChange, DataTableStartup] = HookDataTable({
    isLoading, setIsLoading,
    Get: GetStartup,
    columns: columnsStartup({t, startupCategorys, handleEditStartup, handleDeleteStartup, handlePatchStartup, checkPermission}),
    leftHeader: (
      <Space>
        {checkPermission(routerLinks("Startup", "api"), "POST") && (
          <Button type="primary" onClick={() => handleEditStartup()}>
            <i className="las la-plus la-lg mr-5"/>
            {t('routes.Admin.User.addNew')}
          </Button>
        )}
        {checkPermission(routerLinks("StartupCategory", "api")) && (
          <Button type="primary" onClick={ handleShowDragStartupCategory }>
            <i className="las la-briefcase la-lg mr-5"/>
            {t('routes.Admin.Startup.StartupCategory')}
          </Button>
        )}
      </Space>
    )
  });

  return (
    <Fragment>
      {ModalDragStartupCategory()}
      {DataTableStartup()}
      {ModalFormStartup()}
    </Fragment>
  );
};
