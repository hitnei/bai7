import React, { useState, useEffect, Fragment } from "react";
import {
  Badge, Breadcrumb, Button, Card, Checkbox, Col, Drawer, message, Modal, Popconfirm, Popover, Row, Spin, Tabs, Tooltip,
  Upload, Form as FormAnt
} from "antd";

import Form from "../Form";
import { getList_MEDIA, save_MEDIA, delete_MEDIA } from "./service";
import {useAuth} from "../../global";
import {useTranslation} from "react-i18next";

export default ({isVisible = false, onSelect, limit = 1, onHide}) => {
  const { t } = useTranslation();
  const langPrefix = 'components.MediaManagement';
  const auth = useAuth();
  const propsUpload = {
    action: '/api/v1/media',
    headers: {
      Authorization: auth.user.token,
      "X-localization": localStorage.getItem('i18nextLng')
    },
    listType: 'picture',
    className: "upload-block",
    multiple: true,
    data: (file) => ({file, path: url}),
    onChange: (data) => {
      if (data.file.percent && data.file.status === "error") return message.error(data.file.response.message);
      if (data.file.percent === 100 && data.event) setTimeout(() => getList(url), 500);
    }
  };

  useEffect(async () => await getList('/'), []);

  const detail = item => (
    <>
      <div>{t(langPrefix + '.filename')}: {item.name}</div>
      {item.type !== "folder" && (
        <>
          <div>{t(langPrefix + '.fileSize')}: {item.size}</div>
          <div>{t(langPrefix + '.lastModified')}: {item.lastModified}</div>
        </>
      )}
    </>
  );

  const title = (file) => {
    const {user} = auth;
    return (
      <Row justify="space-between" align="middle">
        <div>{t(langPrefix + '.detail')}</div>
        <Button.Group>
          {user["role_id"] === 1 && (
            <Popconfirm
              title={t(langPrefix + '.areYouSure')}
              icon={<i className="las la-question-circle"/>}
              onConfirm={() => handleDelete(file)}
            >
              <Button size="small" type="link" danger>
                <i className="las la-lg la-trash-alt"/>
              </Button>
            </Popconfirm>
          )}
        </Button.Group>
      </Row>
    );
  };

  const [multi, setMulti] = useState(false);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState(1);
  const [data, setData] = useState([]);
  const [url, setUrl] = useState('/');
  const [isVisibleDraw, setIsVisibleDraw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async file => {
    setIsLoading(true);
    try {
      await delete_MEDIA({
        path: file.origin,
        type: file.type,
      });
      await getList(url);
    } catch {
      setIsLoading(false);
    }
  };

  const getUrl = (index = 1) => {
    setIsLoading(true);
    const array = url.split("/");
    if (array.length > 2) {
      return getList(array.slice(0, index).join("/") + '/');
    }
    return getList("/");
  };

  const getList = async (url) => {
    setIsLoading(true);
    const data = await getList_MEDIA(url);
    setIsLoading(false);
    setUrl(url);
    setData(data);
  };

  const [form] = FormAnt.useForm();
  const onSubmit = async (value) => {
    form.resetFields();
    setIsLoading(false);
    value.type = "folder";
    value.path = url;
    await save_MEDIA(value);
    await getList(url);
  };

  useEffect(() => {
    if (limit === 1 && multi) setMulti(false);
  }, [isVisible]);


  return (
    <Fragment>
      <Modal
        title={t(langPrefix + '.mediaManagement')}
        width={800}
        visible={isVisible}
        footer={null}
        centered={true}
        onCancel={onHide}
      >
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={t(langPrefix + '.filesOnSystem')} key="1">
            <Row justify="space-between" style={{paddingBottom: "10px"}}>
              <Col>
                <Breadcrumb>
                  {url.split("/").map((item, index) => {
                    return (
                      <Breadcrumb.Item key={index} onClick={() => getUrl(index + 1)}>
                        {index === 0 ? <i className="las la-lg la-home"/> : item}
                      </Breadcrumb.Item>
                    );
                  })}
                </Breadcrumb>
              </Col>
              <Col>
                <Button.Group>
                  {(multi && images.length && limit > 1) ? (
                    <Tooltip title={t(langPrefix + '.addFiles')}>
                      <Button type="primary" size="small" onClick={() => {
                        images.map((url, index) => { if (index < limit) onSelect(url, 'image'); return null;});
                        setImages([]);
                      }}>
                        <i className="las la-lg la-plus-square" />
                      </Button>
                    </Tooltip>
                  ) : null}
                  {limit > 1 && (
                    <Tooltip title={t(langPrefix + '.multiFiles')}>
                      <Button type="primary" size="small" onClick={() => setMulti(!multi)} danger={multi}>
                        <i className="las la-lg la-images"/>
                      </Button>
                    </Tooltip>
                  )}
                  <Tooltip title={t(langPrefix + '.createFolder')}>
                    <Button type="primary" size="small" onClick={() => {setIsVisibleDraw(true); setStatus(1);}}>
                      <i className="las la-lg la-folder-plus"/>
                    </Button>
                  </Tooltip>
                  <Tooltip title={t(langPrefix + '.uploadFile')}>
                    <Button type="primary" size="small" onClick={() => {setIsVisibleDraw(true); setStatus(2);}}>
                      <i className="las la-lg la-file-upload"/>
                    </Button>
                  </Tooltip>
                </Button.Group>
              </Col>
            </Row>
            <Spin spinning={isLoading}>
              <Row gutter={[16, 16]} align="middle">
                {url.slice(1).split("/").length > 1 && (
                  <Col span={6}>
                    <Card
                      onClick={() => !multi && getUrl(url.split("/").length - 2)}
                      bodyStyle={{padding: 10, textAlign: "center"}}
                      hoverable
                    >
                      <i className="las la-level-up-alt la-3x"/>
                      <div>{t(langPrefix + '.moveUpLevel')}</div>
                    </Card>
                  </Col>
                )}
                {data.map((item, index) => (
                  <Col span={6} key={index}>
                    <Popover content={detail(item)} title={title(item)}>
                      <Badge count={(item.type !== "folder" && multi) ?
                        <Checkbox checked={images.indexOf(item.url) > -1}/> : null}>
                        <Card
                          onClick={() => {
                            if (!multi) (item.type === "folder" ? getList(url + item.name + "/") : onSelect(item.url, item.type));
                            else if (item.type !== "folder") {
                              if (images.indexOf(item.url) === -1) images.push(item.url);
                              else images.splice(images.indexOf(item.url), 1);
                              setImages(JSON.parse(JSON.stringify(images)));
                            }
                          }}
                          bodyStyle={{padding: item.type !== "folder" ? 0 : 10, textAlign: "center"}}
                          hoverable
                          cover={(item.type === "jpeg" || item.type === "png") && <img alt="example" src={item.url}/>}
                        >
                          {(item.type !== "jpeg" && item.type !== "png") && (
                            <>
                              {item.type === "folder" && <i className="las la-folder-open la-3x"/>}
                              {item.type === "pdf" && <i className="las la-file-pdf la-3x"/>}
                              <div className="word-break">{item.name}</div>
                            </>
                          )}
                        </Card>
                      </Badge>
                    </Popover>
                  </Col>
                ))}
              </Row>
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab={t(langPrefix + '.outsideLink')} key="2">
            <Form
              columns={[
                {
                  title: t(langPrefix + '.outsideLink'),
                  name: "link",
                  formItem: {
                    rules: [
                      { type: 'required' },
                      { type: 'url' },
                    ]
                  }
                }
              ]}
              loading={false}
              textSubmit={t(langPrefix + '.save')}
              handSubmit={(value) => {
                onSelect(value.link, 'image');
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Drawer
        title={status === 1 ? t(langPrefix + '.createFolder') : t(langPrefix + '.uploadFile')}
        placement="right"
        closable={false}
        onClose={() => setIsVisibleDraw(false)}
        visible={isVisibleDraw}
      >
        {status === 1 ? (
          <Form
            form={form}
            columns={[
              {
                title: t(langPrefix + '.nameFolder'),
                name: "name",
                formItem: {
                  rules: [
                    {type: 'required'},
                    {
                      type: 'custom',
                      validator: () => ({
                        validator(rule, value) {
                          return /^[a-zA-Z\d]+$/.test(value) ? Promise.resolve() : Promise.reject(t(langPrefix + '.onlyLettersAndDigitsAllowed'));
                        }
                      })
                    }
                  ]
                }
              }
            ]}
            loading={false}
            textSubmit={t(langPrefix + '.save')}
            handSubmit={onSubmit}
          />
        ) : (
          <Upload {...propsUpload}>
            <Button block>
              <i className="las la-lg la-file-upload"/> {t(langPrefix + '.uploadFile')}
            </Button>
          </Upload>
        )}
      </Drawer>
    </Fragment>
  );
};
