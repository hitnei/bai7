import moment from 'moment';

const renderChange = (obj, model, list) => {
  const convertData = (key, value, list, model) => {
    const {roles, status, canPermission} = list;
    let array;
    switch (key) {
      case 'role_id':
        return roles.length > 0 ? roles.filter(item => item.value === value)[0].label : value;
      case 'status':
        return status.filter(item => item.value === value)[0].label;
      case 'can':
        array = JSON.parse(value).map(item => {
          let text;
          canPermission.map(can => {
            if (!text && can.value === item) text = can.label;
            return null;
          });
          return text;
        });
        return JSON.stringify(array);
      default:
        return value;
    }
  };
  const array = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      array.push(
        <li key={model + '_' + key}>
          {model + '_' + key}:
          <small> <strong>{convertData(key, obj[key], list, model)}</strong></small>
        </li>
      );
    }
  }
  return <ul>{array}</ul>;
};

export const columns = ({langPrefix, t}) => {
  const models = [
    {value: "User", label: t('titles.User')},
    {value: "Role", label: t('titles.Role')},
    {value: "Permission", label: t('titles.Permission')},
    {value: "Activity", label: t('titles.Activity')},
    {value: "Setting", label: t('titles.Setting')},
    {value: "RolePermission", label: t('titles.RolePermission')},
  ];
  const status = [
    {value: 0, label: t(langPrefix + '.disable')},
    {value: 1, label: t(langPrefix + '.enable')},
  ];
  const canPermission = [
    {value: "POST", label: t(langPrefix + '.add')},
    {value: "GET", label: t(langPrefix + '.view')},
    {value: "PUT", label: t(langPrefix + '.modify')},
    {value: "DELETE", label: t(langPrefix + '.delete')},
  ];
  const list = {
    status, canPermission,
  };

  return [
    {
      title: t(langPrefix + '.userName'),
      name: 'user_name',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
    },
    {
      title: t(langPrefix + '.modelName'),
      name: 'model_name',
      tableItem: {
        filter: {
          type: 'radio',
          list: models,
        },
        render(text) {
          return text;
        }
      },
    },
    {
      title: t(langPrefix + '.modelId'),
      name: 'model_id',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      }
    },
    {
      title: t(langPrefix + '.description'),
      name: 'description',
      tableItem: {
        sorter: true,
        render: (text, record) => {
          return text;
        }
      },
    },
    {
      title: t(langPrefix + '.changes'),
      name: 'changes',
      tableItem: {
        render: (text, record) => {
          return !!text ? (
            <>
              <div>
                <strong>{t(langPrefix + '.before')}:</strong>
                {renderChange(text.before,record['model_name'], list)}
              </div>
              <hr/>
              <div>
                <strong>{t(langPrefix + '.after')}:</strong>
                {renderChange(text.after,record['model_name'], list)}
              </div>
            </>
          ) : '';
        }
      },
    },
    {
      title: t(langPrefix + '.ipAddress'),
      name: 'ip-address',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
    },
    {
      title: t(langPrefix + '.device'),
      name: 'device',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
    },
    {
      title: t(langPrefix + '.platform'),
      name: 'platform',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
    },
    {
      title: t(langPrefix + '.browser'),
      name: 'browser',
      tableItem: {
        filter: {type: 'search'},
        sorter: true,
      },
    },
    {
      title: t(langPrefix + '.createdAt'),
      name: 'created_at',
      tableItem: {
        filter: {type: 'date'},
        sorter: true,
        render(text) {
          return moment(text).format("DD/MM/YYYY HH:mm:ss");
        }
      },
    },
  ];
};
