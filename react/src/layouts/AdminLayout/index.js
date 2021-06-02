import React, {useState, Fragment, useEffect} from 'react';
import {Layout, Menu, Button, Row, Col, Select, Popover, Avatar, Tabs, List, Skeleton, Drawer, Divider, Spin  } from 'antd';
import classNames from 'classnames';
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import {rodeIdAdmin} from "../../utils/variable";

import {useAuth} from "../../global";
import routerLinks from "../../utils/routerLinks";
import menus from "./menus";

const { Header, Footer, Sider, Content } = Layout;
const { TabPane } = Tabs;
import logo from '../../assets/images/logo-light.png';
import './index.scss';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default ({ children }) => {
  const { t, i18n } = useTranslation();
  const auth = useAuth();
  const history = useHistory();
  const year = new Date().getFullYear();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const iconClasses = classNames({
    'las': true,
    'la-outdent': isCollapsed,
    'la-indent': !isCollapsed,
  });

  const handCollapse = () => setIsCollapsed(!isCollapsed);
  const [visible, setVisible] = useState(false);
  const handleShowDrawer = () => setVisible(true);
  const handleCloseDrawer = () => setVisible(false);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let _menus = menus();
  if (auth.user.role_id !== rodeIdAdmin) {
    const _permissions = {[routerLinks("Profile")]: ["GET"]};
    auth.user.permissions.map((item) => _permissions[item.permission_route] = item.can);

    _menus = _menus.filter((item) => {
      let check = false;
      for (const key of Object.keys(_permissions)) {
        if (!item.child && !check && routerLinks(item.name).indexOf(key) === 0) {
          check = true;
        } else if (!!item.child && !check && item.child.length > 0) {
          item.child = item.child.filter((childItem) => {
            let _check = false;
            for (let key of Object.keys(_permissions)) {
              if (!_check) _check = routerLinks(childItem.name).indexOf(key) === 0;
            }
            return _check;
          });
          check = item.child.length > 0;
        }
      }
      return check;
    });
  }

  const siderBar = (<Sider trigger={null} collapsible collapsed={windowDimensions.width > 767 ? isCollapsed : false} width={180}>
    <div className="logo">
      <img src={logo} height="50" alt=""/>
      <h1>Levinci</h1>
    </div>
    <Menu
      mode={windowDimensions.width > 767 ? "vertical" : "inline"}
      theme="dark"
      defaultSelectedKeys={[history.location.pathname]}
    >
      {_menus.map(({title, child}, index) => (
        <Menu.ItemGroup key={index} title={t('titles.' + title)}>
          {child.map(({icon, name, subMenu}) => (
            subMenu ?
              <Menu.SubMenu key={routerLinks(name)} icon={<i className={icon}/>} title={t('titles.' + name)}>
                {subMenu.map(({name}) => (
                  <Menu.Item key={routerLinks(name) + name}>{name}</Menu.Item>
                ))}
              </Menu.SubMenu>
              : <Menu.Item
                onClick={() => history.push(routerLinks(name))}
                key={routerLinks(name)}
                icon={<i className={icon}/>}
              >
                {t('titles.' + name)}
              </Menu.Item>
          ))}
        </Menu.ItemGroup>
      ))}
    </Menu>
  </Sider>);

  return (
    <Layout className="admin">
      {windowDimensions.width > 767 ? siderBar : (
        <Drawer
          className="menu-admin"
          width={180}
          placement="left"
          closable={false}
          visible={isCollapsed}
          onClose={() => setIsCollapsed(!isCollapsed)}
        >
          {siderBar}
        </Drawer>
      )}
      <Layout>
        <Header>
          <Row justify="space-between">
            <Col>
              <Button className="trigger" type="text" onClick={handCollapse}>
                <i className={iconClasses} />
              </Button>
            </Col>
            <Col>
              <Popover content={content} title={null} trigger="click" placement="bottomRight">
                <div className="header-action">
                  <i className="las la-bell" />
                  <span className="ringing" />
                </div>
              </Popover>
              <div className="header-action" onClick={handleShowDrawer}>
                <span className="txt-username">Hi, <strong>Admin</strong></span>
                <Avatar shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              </div>
            </Col>
          </Row>
          {drawer({handleCloseDrawer, visible, history})}
          <Row className="sub_header" justify="space-between">
            <Col>
              <h5>{t(auth.title)}</h5>
            </Col>
            <Select value={i18n.language} style={{width: 100}} onChange={(values) => i18n.changeLanguage(values)}>
              <Select.Option value="vi">Vietnam</Select.Option>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="ja">Japan</Select.Option>
            </Select>
          </Row>
        </Header>
        <Content>{children}</Content>
        <Footer className="text-center">
          Levinci Co., Ltd ©{year} Implement By React
        </Footer>
      </Layout>
    </Layout>
  );
};
const drawer = ({handleCloseDrawer, visible, history}) => (
  <Drawer
    width={370}
    title="User Profile"
    placement="right"
    onClose={handleCloseDrawer}
    visible={visible}
  >
    <Spin spinning={false}>
      <Row justify="space-between" align="middle">
        <Col flex="0 1 100px">
          <Avatar size={100} shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
        </Col>
        <Col flex="1 1 200px">
          <strong>Admin</strong><br/>
          <span>Application Developer</span><br/>
          <a><i className="las la-envelope la-lg"/></a> jm@softplus.com<br/>
          <Button type="primary" onClick={() => history.replace(`/auth/login`)}>Sign Out</Button>
        </Col>
      </Row>
      <Divider/>
      <List
        itemLayout="horizontal"
        dataSource={list1}
        renderItem={item => (
          <List.Item className={item.class}>
            <List.Item.Meta
              avatar={<i className={item.icon}/>}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
      <Divider/>
      <h3>Recent Notifications</h3>
      <List
        className="bg-color"
        itemLayout="horizontal"
        dataSource={list2}
        renderItem={item => (
          <List.Item className={item.class} actions={[<strong>{item.content}</strong>]}>
            <List.Item.Meta
              avatar={<i className={item.icon}/>}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Spin>
  </Drawer>
);

const content = (
  <Fragment>
    <div className="title-bg">
      <h2>User Notifications</h2>
      <Button className="green" type="primary" size="small">23 new</Button>
    </div>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Alert" key="1">
        <List
          itemLayout="horizontal"
          dataSource={[0,1,2,3,4,5]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title="We supply a series of design"
                description="10 days"
              />
            </List.Item>
          )}
        />
      </TabPane>
      <TabPane tab="Events" key="2">
        <Skeleton avatar paragraph={{ rows: 0 }} active/>
      </TabPane>
      <TabPane tab="Logs" key="3">
        <List
          itemLayout="horizontal"
          dataSource={[]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title="We supply a series of design"
                description="10 days"
              />
            </List.Item>
          )}
        />
      </TabPane>
    </Tabs>
  </Fragment>
);

const list1 = [
  {class: 'success', icon: 'las la-user la-lg', title: 'Personal center', description: 'Account settings and more'},
  {class: 'warning', icon: 'las la-sms la-lg', title: 'My Messages', description: 'Inbox and tasks'},
  {class: 'danger', icon: 'las la-history la-lg', title: 'My Activities', description: 'Logs and notifications'},
  {class: 'info', icon: 'las la-briefcase la-lg', title: 'My Tasks', description: 'Latest tasks and projects'},
];

const list2 = [
  {class: 'success', icon: 'las la-user la-lg', title: 'Another purpose persuade', description: 'Due in 2 Days', content: '+28%'},
  {class: 'warning', icon: 'las la-sms la-lg', title: 'Would be to people', description: 'Due in 2 Days', content: '+50%'},
  {class: 'danger', icon: 'las la-history la-lg', title: 'Purpose would be to persuade', description: 'Due in 2 Days', content: '-27%'},
  {class: 'info', icon: 'las la-briefcase la-lg', title: 'The best product', description: 'Due in 2 Days', content: '+8%'},
];
