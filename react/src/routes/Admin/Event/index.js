import React, { useState, Fragment, useEffect } from "react";
import {Button, Space} from 'antd';

import HookDataTable from "../../../hooks/DataTable";
import HookModalForm from "../../../hooks/ModalForm";
import HookModalDrag from "../../../hooks/ModalDrag";

import {
  columnsEvent,
  columnsEventCategory,
} from "./column";
import {useTranslation} from "react-i18next";
import {
  GetEvent, PostEvent, PutEvent, DeleteEvent, PatchEvent,
  GetEventCategory, PutEventCategory,
} from "./service.js";
import {useAuth} from "../../../global";
import routerLinks from "../../../utils/routerLinks";

export default () => {
  const { t } = useTranslation();
  const {checkPermission} = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [eventCategorys, setEventCategorys] = useState([]);
  useEffect(async () => {
    if (checkPermission(routerLinks("EventCategory", "api"))) {
      const _data = await GetEventCategory();
      setEventCategorys(_data);
    }
  }, []);

  const [handleEditEvent, handlePatchEvent, handleDeleteEvent, ModalFormEvent] = HookModalForm({
    title: (data) => !data?.id ? t('routes.Admin.User.addNew') : t('routes.Admin.User.edit'),
    isLoading, setIsLoading,
    handleChange: async () => {
      return await handleChange();
    },
    columns: columnsEvent({
      t,
      eventCategorys: eventCategorys
    }),
    Post: PostEvent,
    Put: PutEvent,
    Patch: PatchEvent,
    Delete: DeleteEvent,
    firstRun: async () => {
      if (checkPermission(routerLinks("EventCategory", "api"))) {
        const _data = await GetEventCategory();
        setEventCategorys(_data);
      }
    }
  });
  const [handleShowDragEventCategory, ModalDragEventCategory] = HookModalDrag({
    title: t('routes.Admin.Event.EventCategory'),
    isLoading, setIsLoading,
    columns: columnsEventCategory({t}),
    Get: GetEventCategory,
    Put: PutEventCategory,
    namePermission: "EventCategory",
  });

  const [handleChange, DataTableEvent] = HookDataTable({
    isLoading, setIsLoading,
    Get: GetEvent,
    columns: columnsEvent({t, eventCategorys, handleEditEvent, handleDeleteEvent, handlePatchEvent, checkPermission}),
    leftHeader: (
      <Space>
        {checkPermission(routerLinks("Event", "api"), "POST") && (
          <Button type="primary" onClick={() => handleEditEvent()}>
            <i className="las la-plus la-lg mr-5"/>
            {t('routes.Admin.User.addNew')}
          </Button>
        )}
        {checkPermission(routerLinks("EventCategory", "api")) && (
          <Button type="primary" onClick={ handleShowDragEventCategory }>
            <i className="las la-briefcase la-lg mr-5"/>
            {t('routes.Admin.Event.EventCategory')}
          </Button>
        )}
      </Space>
    )
  });

  return (
    <Fragment>
      {ModalDragEventCategory()}
      {DataTableEvent()}
      {ModalFormEvent()}
    </Fragment>
  );
};
