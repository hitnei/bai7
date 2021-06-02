export const task = ({langPrefix, t, listStatus}) => {
  return [
    {
      title: "Name",
      name: 'name',
      formItem: {}
    },
    {
      title: "Description",
      name: 'description',
      formItem: {
        type: "textarea",
      }
    },
    {
      title: "Status",
      name: 'status',
      formItem: {
        type: "select",
        list: listStatus,
      }
    },
  ];
};

export const column = ({langPrefix, t}) => {
  return [
    {
      title: "Name",
      name: 'name',
      formItem: {}
    },
    {
      title: "Description",
      name: 'description',
      formItem: {
        type: "textarea",
      }
    },
  ];
};
