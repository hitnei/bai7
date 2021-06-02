import {Button, Popconfirm, Space, Tooltip} from "antd";
import moment from 'moment';

import {check_slug} from '../User/service';
import {slugify, convertToFiltersTable, formatTreeSelect} from "../../../utils/core";

export const columns = ({t, menus, handleEdit, handleDelete, handlePatch}) => {
  return [
    {
      title: t('routes.Admin.User.name'),
      name: 'name',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
      formItem: {
        onBlur: (e, form) => {
          const {getFieldValue, setFieldsValue, validateFields} = form;
          if (!getFieldValue("slug")) {
            setFieldsValue({slug: slugify(e.currentTarget.value)});
            validateFields(["slug"]);
          }
        },
        rules: [ { type: 'required' } ]
      },
    },
    {
      title: t('routes.Admin.Blog.slug'),
      name: 'slug',
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
                if (!!value && value.trim() !== "") {
                  const data = await check_slug({
                    slug: value,
                    id: getFieldValue("id"),
                    model: "blogs"
                  });
                  if (data) return Promise.resolve();
                  else return Promise.reject('The slug has already been taken');
                } else return Promise.resolve();
              },
            })
          },
          { type: 'required' }
        ]
      },
    },
    {
      title: t('routes.Admin.Page.Menu'),
      name: 'name|pages.page_menu_id',
      tableItem: {
        filter: {
          type: "checkbox",
          list: menus
        },
        render: (text, record) => record.page_menu.name
      },
    },
    {
      title: t('routes.Admin.Page.Menu'),
      name: 'page_menu_id',
      formItem: {
        type: "select",
        list: menus,
        rules: [
          { type: 'required' },
        ]
      },
    },
    {
      title: t('routes.Admin.Blog.keyword'),
      name: "keyword",
      formItem: {
      }
    },
    {
      title: t('routes.Admin.User.status'),
      name: "status",
      formItem: {
        type: "switch",
      }
    },
    {
      title: t('routes.Admin.User.description'),
      name: 'description',
      formItem: {
        type: "textarea"
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
      title: t('routes.Admin.Blog.content'),
      name: 'content',
      formItem: {
        type: "editor",
      },
    },
    {
      title: t('routes.Admin.User.action'),
      tableItem: {
        render: (text, record) => {
          return (
            <Space size="middle">
              <Tooltip title={t('routes.Admin.User.edit')}>
                <Button onClick={() => handleEdit(record)} size="small" icon={<i className="las la-edit la-lg"/>}/>
              </Tooltip>
              <Tooltip title={t('routes.Admin.User.status')}>
                <Button
                  onClick={() => handlePatch({status: (record.status === 1 ? 0 : 1)}, record.id)}
                  type={record.status === 0 ? "primary" : ""}
                  danger={record.status === 0}
                  size="small"
                  icon={<i className={`las ${record.status === 0 ? "la-low-vision" : "la-eye"}`}/>}
                />
              </Tooltip>
              <Popconfirm placement="left" title={t('components.Datatable.areYouSureWant')}
                          onConfirm={() => handleDelete(record.id)}>
                <Tooltip title={t('routes.Admin.User.delete')}>
                  <Button size="small" icon={<i className="las la-trash-alt la-lg"/>}/>
                </Tooltip>
              </Popconfirm>
            </Space>
          );
        },
      }
    },
  ];
};

export const columnsMenu = ({t}) => [
  {
    title: t('routes.Admin.User.name'),
    name: 'name',
    formItem: {
    },
  },
  {
    title: t('routes.Admin.Page.Type'),
    name: 'type',
    formItem: {
      type: "radio",
      list: [
        {value: 0, label: "Normal Page"},
        {value: 1, label: "Blog page"},
        {value: 2, label: "Event page"},
        {value: 3, label: "Startup page"},
      ],
      rules: [
        { type: 'required' },
      ]
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

export const columnsSlideshow = ({t}) => [
  {
    title: t('routes.Admin.User.name'),
    name: 'name',
    formItem: {
    },
  },
  {
    title: t('routes.Admin.Page.Content'),
    name: 'content',
    formItem: {
      type: "textarea",
    },
  },
  {
    title: t('routes.Admin.Page.Media'),
    name: 'media',
    formItem: {
      type: "media",
      rules: [
        { type: 'required' },
      ]
    },
  },
  {
    title: t('routes.Admin.Page.Link'),
    name: 'link',
    formItem: {
    },
  },
  {
    title: t('routes.Admin.Page.Text Button'),
    name: 'text_button',
    formItem: {
    },
  },
  {
    title: t('routes.Admin.Page.Position'),
    name: 'position',
    formItem: {
      type: "select",
      list: [{value: 1, label: "Left"}, {value: 2, label: "Center"}, {value: 3, label: "Right"}],
      rules: [
        { type: 'required' },
      ]
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

export const columnsBrand = ({t}) => [
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
      type: "textarea"
    },
  },
  {
    title: t('routes.Admin.Brand.Logo'),
    name: 'media',
    formItem: {
      type: "media",
      rules: [
        { type: 'required' },
      ]
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
