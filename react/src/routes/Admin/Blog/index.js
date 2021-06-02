import React, { useState, Fragment, useEffect } from "react";
import {Button, Space} from 'antd';

import HookDataTable from "../../../hooks/DataTable";
import HookModalForm from "../../../hooks/ModalForm";
import HookModalDrag from "../../../hooks/ModalDrag";

import {
  columnsBlog,
  columnsBlogCategory,
} from "./column";
import {useTranslation} from "react-i18next";
import {
  GetBlog, PostBlog, PutBlog, DeleteBlog, PatchBlog,
  GetBlogCategory, PutBlogCategory,
} from "./service.js";
import {useAuth} from "../../../global";
import routerLinks from "../../../utils/routerLinks";

export default () => {
  const { t } = useTranslation();
  const {checkPermission} = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [blogCategorys, setBlogCategorys] = useState([]);
  useEffect(async () => {
    if (checkPermission(routerLinks("BlogCategory", "api"))) {
      const _data = await GetBlogCategory();
      setBlogCategorys(_data);
    }
  }, []);

  const [handleEditBlog, handlePatchBlog, handleDeleteBlog, ModalFormBlog] = HookModalForm({
    title: (data) => !data?.id ? t('routes.Admin.User.addNew') : t('routes.Admin.User.edit'),
    isLoading, setIsLoading,
    handleChange: async () => {
      return await handleChange();
    },
    columns: columnsBlog({
      t,
      blogCategorys: blogCategorys
    }),
    Post: PostBlog,
    Put: PutBlog,
    Patch: PatchBlog,
    Delete: DeleteBlog,
    firstRun: async () => {
      if (checkPermission(routerLinks("BlogCategory", "api"))) {
        const _data = await GetBlogCategory();
        setBlogCategorys(_data);
      }
    }
  });
  const [handleShowDragBlogCategory, ModalDragBlogCategory] = HookModalDrag({
    title: t('routes.Admin.Blog.BlogCategory'),
    isLoading, setIsLoading,
    columns: columnsBlogCategory({t}),
    Get: GetBlogCategory,
    Put: PutBlogCategory,
    namePermission: "BlogCategory",
  });

  const [handleChange, DataTableBlog] = HookDataTable({
    isLoading, setIsLoading,
    Get: GetBlog,
    columns: columnsBlog({t, blogCategorys, handleEditBlog, handleDeleteBlog, handlePatchBlog, checkPermission}),
    leftHeader: (
      <Space>
        {checkPermission(routerLinks("Blog", "api"), "POST") && (
          <Button type="primary" onClick={() => handleEditBlog()}>
            <i className="las la-plus la-lg mr-5"/>
            {t('routes.Admin.User.addNew')}
          </Button>
        )}
        {checkPermission(routerLinks("BlogCategory", "api")) && (
          <Button type="primary" onClick={ handleShowDragBlogCategory }>
            <i className="las la-briefcase la-lg mr-5"/>
            {t('routes.Admin.Blog.BlogCategory')}
          </Button>
        )}
      </Space>
    )
  });

  return (
    <Fragment>
      {ModalDragBlogCategory()}
      {DataTableBlog()}
      {ModalFormBlog()}
    </Fragment>
  );
};
