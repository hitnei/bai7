export const columns = ({langPrefix, t}) => {
  return [
    {
      name: 'email',
      title: t(langPrefix + '.email'),
      formItem: {
        rules: [ { type: 'required' }, { type: 'email' } ]
      }
    },
    {
      name: 'password',
      title: t(langPrefix + '.password'),
      formItem: {
        type: 'password',
        confirm: true,
        rules: [ { type: 'required' } ]
      }
    },
    {
      name: 'phoneNumber',
      title: t(langPrefix + '.phoneNumber'),
      formItem: {
        type: 'mask',
        mask: '011-111-1111',
        rules: [ { type: 'required' } ]
      }
    },
    {
      name: 'agreement',
      title: '',
      formItem: {
        type: 'checkbox',
        list: [
          { value: true, label: t(langPrefix + '.agreement') }
        ]
      }
    },
  ];
};
