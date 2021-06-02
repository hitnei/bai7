export default (name, type) => {
  const types = {
    curd: "?pageNum=1&pageSize=10&filters={}&sorts={\"updated_at\":\"descend\"}"
  };
  const array = {
    Register: '/auth/register',
    Login: '/auth/login',
    Home: '/home',
    Profile: '/setting/profile',
    Website: '/setting/website',
    Activity: '/activity',
    Trello: '/trello',
    Chat: '/chat',
    Blog: '/blog',
    BlogCategory: '/blog-category',
    Page: '/page',
    PageMenu: '/page-menu',
    PageSlideshow: '/page-slideshow',
    Brand: '/brand',
    User: '/user',
    Role: '/role',
    RolePermission: '/rolepermission',
    Event: '/event',
    EventCategory: '/eventcategory',
    Startup: '/startup',
    StartupCategory: '/startupcategory',
    Member: '/member',
    MemberCategory: '/membercategory',
  };// 💬 generate link to here

  const apis = {
    CheckSlug: '/check-slug',
    Permission: '/permission',
    Profile: '/auth',
    Website: '/setting',
    Activity: '/activity',
    Trello: '/trello',
    Chat: '/chat',
    Page: '/page',
    PageMenu: '/page-menu',
    PageSlideshow: '/page-slideshow',
    Brand: '/brand',
    User: '/user',
    Role: '/role',
    RolePermission: '/role-permission',
    Blog: '/blog',
    BlogCategory: '/blog-category',
    Event: '/event',
    EventCategory: '/event-category',
    Startup: '/startup',
    StartupCategory: '/startup-category',
    Member: '/member',
    MemberCategory: '/member-category',
  };// 💬 generate api to here

  switch(type) {
    case "curd":
      return array[name] + types[type];
    case "api":
      return apis[name];
    default:
      return array[name];
  }
};
