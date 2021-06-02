import {Button, Popconfirm, Space, Tooltip} from "antd";
import moment from 'moment';

import routerLinks from "../../../utils/routerLinks";
import {check_slug} from '../User/service';
import {slugify, convertToFiltersTable, formatTreeSelect} from "../../../utils/core";

export const columnsBlog = ({t,
  blogCategorys,
  handleEditBlog, handleDeleteBlog, handlePatchBlog, checkPermission
}) => {
  return [
    {
      title: t('routes.Admin.Blog.image'),
      name: 'media',
      tableItem: {
        render: (url) => url ? <img src={url} alt="" width="50"/> : t('routes.Admin.User.noImage')
      },
      formItem: {
        type: "media",
        rules: [ { type: 'required' } ]
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
      title: t('routes.Admin.Blog.BlogCategory'),
      name: 'categories.blog_category_id',
      tableItem: {
        filter: {
          type: "checkbox",
          list: convertToFiltersTable(blogCategorys)
        },
        render: (text, record) => record.categories.map(item => item.name).join(", ")
      },
    },
    {
      title: t('routes.Admin.Blog.BlogCategory'),
      name: 'category_id',
      formItem: {
        type: "tree_select",
        list: formatTreeSelect(blogCategorys),
        mode: "multiple",
        rules: [
          { type: 'required' },
        ]
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
      title: t('routes.Admin.User.action'),
      tableItem: {
        render: (text, record) => {
          record.category_id = record.categories.map(item => item.id);
          return (
            <Space size="middle">
              {checkPermission(routerLinks("Blog", "api"), "PUT") && (
                <Tooltip title={t('routes.Admin.User.edit')}>
                  <Button onClick={() => handleEditBlog(record)} size="small"
                          icon={<i className="las la-edit la-lg"/>}/>
                </Tooltip>
              )}
              {checkPermission(routerLinks("Blog", "api"), "PUT") && (
                <Tooltip title={t('routes.Admin.User.status')}>
                  <Button
                    onClick={() => handlePatchBlog({status: (record.status === 1 ? 0 : 1)}, record.id)}
                    type={record.status === 0 ? "primary" : ""}
                    danger={record.status === 0}
                    size="small"
                    icon={<i className={`las ${record.status === 0 ? "la-low-vision" : "la-eye"}`}/>}
                  />
                </Tooltip>
              )}
              {checkPermission(routerLinks("Blog", "api"), "DELETE") && (
                <Popconfirm placement="left" title={t('components.Datatable.areYouSureWant')}
                            onConfirm={() => handleDeleteBlog(record.id)}>
                  <Tooltip title={t('routes.Admin.User.delete')}>
                    <Button size="small" icon={<i className="las la-trash-alt la-lg"/>}/>
                  </Tooltip>
                </Popconfirm>
              )}
            </Space>
          );
        },
      }
    },
  ];
};
export const columnsBlogCategory = ({t}) => [
  {
    title: t('routes.Admin.User.name'),
    name: 'name',
    formItem: {
      onBlur: (e, form) => {
        const {getFieldValue, setFieldsValue, validateFields} = form;
        if (!getFieldValue("slug")) {
          setFieldsValue({slug: slugify(e.currentTarget.value)});
          validateFields(["slug"]);
        }
      },
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
                  model: "blog_categories"
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
    title: t('routes.Admin.Blog.keyword'),
    name: "keyword",
    formItem: {
    }
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
