export const columns = ({langPrefix, t}) => {
  return [
    {
      title: t(langPrefix + '.avatar'),
      name: 'avatar',
      formItem: {
        type: "media",
      }
    },
    {
      title: t(langPrefix + '.bio'),
      name: 'bio',
      formItem: {
        type: "textarea",
      }
    },
    {
      title: t(langPrefix + '.name'),
      name: 'name',
      formItem: {
        rules: [ { type: 'required' } ]
      }
    },
    {
      title: t(langPrefix + '.email'),
      name: 'email',
      formItem: {
        readonly: true
      }
    },
    {
      name: 'password',
      title: t(langPrefix + '.password'),
      formItem: {
        type: 'password',
        confirm: true,
      }
    },
  ];
};
