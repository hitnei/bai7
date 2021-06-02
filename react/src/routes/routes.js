import React from "react";
import routerLinks from "../utils/routerLinks";

export const routes = [
  {
    layout: React.lazy(() => import('../layouts/AuthLayout')),
    isPublic: true,
    child: [
      {
        path: routerLinks('Login'),
        component: React.lazy(() => import('./Auth/Login')),
        title: 'Login'
      },
      {
        path: routerLinks('Register'),
        component: React.lazy(() => import('./Auth/Register')),
        title: 'Register'
      }
    ]
  },
  {
    layout: React.lazy(() => import('../layouts/AdminLayout')),
    isPublic: false,
    child: [
      {
        path: routerLinks('Profile'),
        component: React.lazy(() => import('./Admin/Profile')),
        title: 'Profile'
      },
      {
        path: routerLinks('Website'),
        component: React.lazy(() => import('./Admin/Website')),
        title: 'Website'
      },
      {
        path: routerLinks('Activity'),
        component: React.lazy(() => import('./Admin/Activity')),
        title: 'Activity'
      },
      {
        path: routerLinks('Trello'),
        component: React.lazy(() => import('./Admin/Trello')),
        title: 'Trello'
      },
      {
        path: routerLinks('Chat'),
        component: React.lazy(() => import('./Admin/Chat')),
        title: 'Chat'
      },
      {
        path: routerLinks('Page'),
        component: React.lazy(() => import('./Admin/Page')),
        title: 'Page'
      },
      {
        path: routerLinks('User'),
        component: React.lazy(() => import('./Admin/User')),
        title: 'User'
      },
      {
        path: routerLinks('Blog'),
        component: React.lazy(() => import('./Admin/Blog')),
        title: 'Blog'
      },
      {
        path: routerLinks('Event'),
        component: React.lazy(() => import('./Admin/Event')),
        title: 'Event'
      },
      {
        path: routerLinks('Startup'),
        component: React.lazy(() => import('./Admin/Startup')),
        title: 'Startup'
      },
      {
        path: routerLinks('Member'),
        component: React.lazy(() => import('./Admin/Member')),
        title: 'Member'
      },
    ]
  }
];
export const arrayPaths = [];
routes.map((layout) => {
  const paths = [];
  layout.child.map((page) => {
    paths.push(page.path);
  });
  arrayPaths.push(paths);
});
