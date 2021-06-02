import React, { useState, Fragment } from "react";
import {Button, Space} from 'antd';

import HookDataTable from "../../../hooks/DataTable";
import HookModalForm from "../../../hooks/ModalForm";
import HookModalDrag from "../../../hooks/ModalDrag";
import HookModalDataTable from "../../../hooks/ModalDataTable";

import {columnsUser, columnsRole, columnsRolePermission } from "./column";
import {useTranslation} from "react-i18next";
import {
  GetUser, PostUser, PutUser, DeleteUser, PatchUser, GetRole, PutRole, GetPermission,
  GetRolePermission, PostRolePermission, PutRolePermission, DeleteRolePermission, PatchRolePermission,
} from "./service.js";
import {useAuth} from "../../../global";
import routerLinks from "../../../utils/routerLinks";

export default () => {
  const { t } = useTranslation();
  const {checkPermission} = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [handleEditUser, handlePatchUser, handleDeleteUser, ModalFormUser] = HookModalForm({
    title: (data) => !data?.id ? t('routes.Admin.User.addNew') : t('routes.Admin.User.edit'),
    isLoading, setIsLoading,
    handleChange: async () => {
      return await handleChange();
    },
    columns: columnsUser({
      t, roles: roles.map(item => ({ label: item.name, value: item.id }))
    }),
    Post: PostUser,
    Put: PutUser,
    Patch: PatchUser,
    Delete: DeleteUser,
    firstRun: async () => {
      if (checkPermission(routerLinks("Role", "api"))) {
        const _data = await GetRole();
        setRoles(_data);
      }
    }
  });
  const [handleEditRolePermission, handlePatchRolePermission, handleDeleteRolePermission, ModalFormRolePermission] = HookModalForm({
    title: (data) => !data?.id ? t('routes.Admin.User.addNew') : t('routes.Admin.User.edit'),
    isLoading, setIsLoading,
    handleChange: async () => {
      return await handleChangeTableRolePermission();
    },
    columns: columnsRolePermission({
      t, permissions: permissions.map((item) => ({ label: item.name, value: item.route }))
    }),
    Post: PostRolePermission,
    Put: PutRolePermission,
    Patch: PatchRolePermission,
    Delete: DeleteRolePermission,
    firstRun: async () => {
      if (checkPermission(routerLinks("Permission", "api"))) {
        const _data = await GetPermission();
        setPermissions(_data);
      }
    }
  });

  const [handleShowTableRolePermission, handleChangeTableRolePermission, ModalDataTableRolePermission] = HookModalDataTable({
    title: t('routes.Admin.User.permission'),
    isLoading, setIsLoading,
    Get: GetRolePermission,
    columns: columnsRolePermission({
      t, handleEditRolePermission, handlePatchRolePermission, handleDeleteRolePermission,
      checkPermission, permissions: permissions.map((item) => ({ label: item.name, value: item.id })),
    }),
    leftHeader: (role_id) => (
      <Space>
        {checkPermission(routerLinks("RolePermission","api", "POST")) && (
          <Button type="primary" onClick={() => handleEditRolePermission({ role_id}) }>
            <i className="las la-plus la-lg mr-5"/>
            {t('routes.Admin.User.addNew')}
          </Button>
        )}
      </Space>
    ),
    firstRun: async () => {
      if (checkPermission(routerLinks("Permission", "api"))) {
        const _data = await GetPermission();
        setPermissions(_data);
      }
    }
  });
  const [handleShowDragRole, ModalDragRole] = HookModalDrag({
    title: t('routes.Admin.User.Role'),
    isLoading, setIsLoading,
    columns: columnsRole({t}),
    Get: GetRole,
    Put: PutRole,
    handleShowModal: handleShowTableRolePermission,
    namePermission: "Role",
  });

  const [handleChange, DataTableUser] = HookDataTable({
    isLoading, setIsLoading,
    Get: GetUser,
    columns: columnsUser({t, handleEditUser, handleDeleteUser, handlePatchUser, checkPermission}),
    leftHeader: (
      <Space>
        {checkPermission(routerLinks("User", "api"), "POST") && (
          <Button type="primary" onClick={() => handleEditUser()}>
            <i className="las la-plus la-lg mr-5"/>
            {t('routes.Admin.User.addNew')}
          </Button>
        )}
        {checkPermission(routerLinks("Role", "api")) && (
          <Button type="primary" onClick={ handleShowDragRole }>
            <i className="las la-briefcase la-lg mr-5"/>
            {t('routes.Admin.User.Role')}
          </Button>
        )}
      </Space>
    )
  });

  return (
    <Fragment>
      {ModalDataTableRolePermission()}
      {ModalDragRole()}
      {DataTableUser()}
      {ModalFormRolePermission()}
      {ModalFormUser()}
    </Fragment>
  );
};
