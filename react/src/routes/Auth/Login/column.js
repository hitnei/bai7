export const columns = ({langPrefix, t}) => {
  return [
    {
      name: 'email',
      title: t(langPrefix + '.email'),
      formItem: {
        rules: [
          { type: 'required' },
          { type: 'email' },
        ]
      }
    },
    {
      name: 'password',
      title: t(langPrefix + '.password'),
      formItem: {
        type: 'password',
        rules: [
          { type: 'required' },
          { type: 'minLength', value: 6 },
          // { type: 'password', min: 6 },
        ]
      }
    },
    {
      name: 'remember',
      title: '',
      formItem: {
        type: 'checkbox',
        list: [
          {
            value: true,
            label: t(langPrefix + '.remember'),
          }
        ]
      }
    },
  ];
};
