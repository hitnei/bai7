import React, { useState, Fragment, useEffect } from "react";
import {Button, Space} from 'antd';

import HookDataTable from "../../../hooks/DataTable";
import HookModalForm from "../../../hooks/ModalForm";
import HookModalDrag from "../../../hooks/ModalDrag";

import {
  columnsMember,
  columnsMemberCategory,
} from "./column";
import {useTranslation} from "react-i18next";
import {
  GetMember, PostMember, PutMember, DeleteMember, PatchMember,
  GetMemberCategory, PutMemberCategory,
} from "./service.js";
import {useAuth} from "../../../global";
import routerLinks from "../../../utils/routerLinks";

export default () => {
  const { t } = useTranslation();
  const {checkPermission} = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [memberCategorys, setMemberCategorys] = useState([]);
  useEffect(async () => {
    if (checkPermission(routerLinks("MemberCategory", "api"))) {
      const _data = await GetMemberCategory();
      setMemberCategorys(_data);
    }
  }, []);

  const [handleEditMember, handlePatchMember, handleDeleteMember, ModalFormMember] = HookModalForm({
    title: (data) => !data?.id ? t('routes.Admin.User.addNew') : t('routes.Admin.User.edit'),
    isLoading, setIsLoading,
    handleChange: async () => {
      return await handleChange();
    },
    columns: columnsMember({
      t,
      memberCategorys: memberCategorys
    }),
    Post: PostMember,
    Put: PutMember,
    Patch: PatchMember,
    Delete: DeleteMember,
    firstRun: async () => {
      if (checkPermission(routerLinks("MemberCategory", "api"))) {
        const _data = await GetMemberCategory();
        setMemberCategorys(_data);
      }
    }
  });
  const [handleShowDragMemberCategory, ModalDragMemberCategory] = HookModalDrag({
    title: t('routes.Admin.Member.MemberCategory'),
    isLoading, setIsLoading,
    columns: columnsMemberCategory({t}),
    Get: GetMemberCategory,
    Put: PutMemberCategory,
    namePermission: "MemberCategory",
  });

  const [handleChange, DataTableMember] = HookDataTable({
    isLoading, setIsLoading,
    Get: GetMember,
    columns: columnsMember({t, memberCategorys, handleEditMember, handleDeleteMember, handlePatchMember, checkPermission}),
    leftHeader: (
      <Space>
        {checkPermission(routerLinks("Member", "api"), "POST") && (
          <Button type="primary" onClick={() => handleEditMember()}>
            <i className="las la-plus la-lg mr-5"/>
            {t('routes.Admin.User.addNew')}
          </Button>
        )}
        {checkPermission(routerLinks("MemberCategory", "api")) && (
          <Button type="primary" onClick={ handleShowDragMemberCategory }>
            <i className="las la-briefcase la-lg mr-5"/>
            {t('routes.Admin.Member.MemberCategory')}
          </Button>
        )}
      </Space>
    )
  });

  return (
    <Fragment>
      {ModalDragMemberCategory()}
      {DataTableMember()}
      {ModalFormMember()}
    </Fragment>
  );
};
