import {Button, Popconfirm, Space, Tooltip} from "antd";
import moment from 'moment';

import {formatEmail} from '../../../utils/variable';
import {check_slug} from '../User/service';
import routerLinks from "../../../utils/routerLinks";
import React from "react";

export const columnsUser = ({t, roles, handleEditUser, handleDeleteUser, handlePatchUser, checkPermission}) => {
  return [
    {
      title: t('routes.Admin.User.avatar'),
      name: 'avatar',
      tableItem: {
        render: (url) => url ? <img src={url} alt="" width="50"/> : t('routes.Admin.User.noImage')
      },
      formItem: {
        type: "media",
      },
    },
    {
      title: t('routes.Admin.User.bio'),
      name: 'bio',
      formItem: {
        type: "textarea",
      },
    },
    {
      title: t('routes.Admin.User.name'),
      name: 'name',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
      formItem: {
        rules: [ { type: 'required' } ]
      },
    },
    {
      title: t('routes.Admin.User.email'),
      name: 'email',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
      formItem: {
        rules: [
          {
            type: 'custom',
            validator: ({ getFieldValue }) => ({
              validator: async (rule, value) => {
                if (!!value && value.trim() !== "" && formatEmail.test(value)) {
                  const data = await check_slug({
                    id: getFieldValue("id"),
                    email: value,
                    model: "users"
                  });
                  if (data) return Promise.resolve();
                  else return Promise.reject('This email address is already taken');
                } else return Promise.resolve();
              },
            })
          },
          { type: 'required' },
          { type: 'email' }
        ]
      },
    },
    {
      title: t('routes.Admin.User.password'),
      name: 'password',
      formItem: {
        type: "password",
        confirm: true,
      },
    },
    {
      title: t('routes.Admin.User.roles'),
      name: 'roles.name|users.role_id',
      tableItem: {
        sorter: true,
        render(text, record) {
          return record.role.name;
        }
      },
    },
    {
      title: t('routes.Admin.User.roles'),
      name: 'role_id',
      formItem: {
        type: 'select',
        list: roles,
        rules: [
          { type: 'required' },
        ]
      },
    },
    {
      title: t('routes.Admin.User.status'),
      name: 'status',
      formItem: {
        type: 'switch',
      },
    },
    {
      title: t('routes.Admin.User.createdAt'),
      name: 'created_at',
      tableItem: {
        filter: {
          type: "date",
        },
        sorter: true,
        render(text) {
          return moment(text).format("DD/MM/YYYY");
        }
      },
    },
    {
      title: t('routes.Admin.User.updatedAt'),
      name: 'updated_at',
      tableItem: {
        filter: { type: "date" },
        sorter: true,
        render(text) {
          return moment(text).format("DD/MM/YYYY");
        }
      },
    },
    {
      title: t('routes.Admin.User.action'),
      tableItem: {
        render: (text, record) => (
          <Space size="middle">
            {checkPermission(routerLinks("User", "api"), "PUT") && (
              <Tooltip title={t('routes.Admin.User.edit')}>
                <Button onClick={() => handleEditUser(record)} size="small" icon={<i className="las la-edit la-lg" />} />
              </Tooltip>
            )}
            {checkPermission(routerLinks("User", "api"), "PUT") && (
              <Tooltip title={t('routes.Admin.User.status')}>
                <Button
                  onClick={() => handlePatchUser({status: (record.status === 1 ? 0 : 1)}, record.id)}
                  type={record.status === 0 ? "primary" : ""}
                  danger={record.status === 0}
                  size="small"
                  icon={<i className={`las ${ record.status === 0 ? "la-low-vision" : "la-eye"}`} />}
                />
              </Tooltip>
            )}
            {checkPermission(routerLinks("User", "api"), "DELETE") && (
              <Popconfirm placement="left" title={t('components.Datatable.areYouSureWant')} onConfirm={() => handleDeleteUser(record.id)}>
                <Tooltip title={t('routes.Admin.User.delete')}>
                  <Button size="small" icon={<i className="las la-trash-alt la-lg" />} />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        ),
      }
    },
  ];
};
export const columnsRole = ({t}) => [
  {
    title: t('routes.Admin.User.name'),
    name: 'name',
    formItem: {
    },
  },
  {
    title: t('routes.Admin.User.description'),
    name: 'description',
    formItem: {
      type: "textarea",
    },
  },
  {
    title: t('routes.Admin.User.status'),
    name: 'status',
    formItem: {
      type: "switch",
    },
  },
];
export const columnsRolePermission = ({t, permissions, handleEditRolePermission, handlePatchRolePermission, handleDeleteRolePermission, checkPermission}) => [
  {
    name: 'role_id',
    formItem: {
      type: 'hidden',
    }
  },
  {
    title: t('routes.Admin.User.permission'),
    name: 'permission_route',
    tableItem: {
    },
    formItem: {
      type: "select",
      list: permissions,
      rules: [
        { type: 'required' },
      ]
    },
  },
  {
    title: t('routes.Admin.User.can'),
    name: 'can',
    tableItem: {
      render(text) {
        return text.join(', ');
      }
    },
    formItem: {
      type: "select",
      mode: "multiple",
      list: [
        { value: "GET", label: t('routes.Admin.User.view') },
        { value: "POST", label: t('routes.Admin.User.add') },
        { value: "PUT", label: t('routes.Admin.User.edit') },
        { value: "DELETE", label: t('routes.Admin.User.delete') },
      ]
    },
  },
  {
    title: t('routes.Admin.User.action'),
    tableItem: {
      render: (text, record) => (
        <Space size="middle">
          {checkPermission(routerLinks("RolePermission", "api"), "PUT") && (
            <Tooltip title={t('routes.Admin.User.edit')}>
              <Button onClick={() => handleEditRolePermission(record)} size="small" icon={<i className="las la-edit la-lg" />} />
            </Tooltip>
          )}
          {checkPermission(routerLinks("RolePermission", "api"), "PUT") && (
            <Tooltip title={t('routes.Admin.User.status')}>
              <Button
                  onClick={() => handlePatchRolePermission({status: (record.status === 1 ? 0 : 1)}, record.id)}
                  type={record.status === 0 ? "primary" : ""}
                  danger={record.status === 0}
                  size="small"
                  icon={<i className={`las ${ record.status === 0 ? "la-low-vision" : "la-eye"}`} />}
              />
            </Tooltip>
          )}
          {checkPermission(routerLinks("RolePermission", "api"), "DELETE") && (
            <Popconfirm placement="left" title={t('components.Datatable.areYouSureWant')} onConfirm={() => handleDeleteRolePermission(record.id)}>
              <Tooltip title={t('routes.Admin.User.delete')}>
                <Button size="small" icon={<i className="las la-trash-alt la-lg" />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    }
  },
];
