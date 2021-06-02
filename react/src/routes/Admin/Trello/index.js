import React, {useState, useEffect, Fragment} from "react";
import './index.scss';
import {Card, Space, Button} from 'antd';
import { smoothDnD } from './smooth-dnd';
import { v4 } from "uuid";
import ModalForm from "../../../components/ModalForm";
import {task, column} from "./column";
import {useTranslation} from "react-i18next";


export default () => {
  const langPrefix = 'routes.Admin.Trello';
  const { t } = useTranslation();

  const [listData, setListData] = useState([
    {
      name: 'Test 1',
      id: v4(),
      child: [
        {name: 'Name 1'},
        {name: 'Name 2'},
        {name: 'Name 3'},
      ]
    },
    {
      name: 'Test 2',
      id: v4(),
      child: [
        {name: 'Name 4'},
        {name: 'Name 5'},
        {name: 'Name 6'},
      ]
    },
    {
      name: 'Test 3',
      id: v4(),
      child: [
        {name: 'Name 7'},
        {name: 'Name 8'},
        {name: 'Name 9'},
      ]
    },
    {
      name: 'Test 4',
      id: v4(),
      child: [
        {name: 'Name 10'},
        {name: 'Name 11'},
        {name: 'Name 12'},
      ]
    },
    {
      name: 'Test 5',
      id: v4(),
      child: [
        {name: 'Name 13'},
        {name: 'Name 14'},
        {name: 'Name 15'},
      ]
    },
  ]);
  const [data, setData] = useState(null);

  const [domData, setDomData] = useState(null);
  const [id] = useState(v4());

  const [domListData, setDomListData] = useState([]);
  const [listStatus, setListStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleColumn, setIsVisibleColumn] = useState(false);

  const handleCancel = () => {
    setIsVisible(false);
    setIsVisibleColumn(false);
  };
  const handleAddNewTask = () => {
    setData(null);
    setIsVisible(true);
  };
  const handleOkTask = async (values) => {
    const {name, description, status} = values;
    if (data && data.status !== status) {
      const _id = listData[data.index].id;
      domListData[_id].dispose();
      listData[data.index].child.splice(data.subIndex, 1);
      setTimeout(() => {
        domListData[_id] = smoothDnD(document.getElementById(_id), {
          groupName: id,
          getChildPayload: (index) => console.log(index)
        });
      });
    }
    domListData[status].dispose();

    if (!data || data.status !== status) {
      let index = -1;
      listData.map((item, i) => {
        if (index === -1 && item.id === status) {
          index = i;
        }
      });
      listData[index].child.push({name, description});
    } else {
      listData[data.index].child[data.subIndex] = {name, description};
    }

    setIsVisible(false);
    setTimeout(() => {
      domListData[status] = smoothDnD(document.getElementById(status), {
        groupName: id,
        getChildPayload: (index) => console.log(index)
      });
    });

  };

  const handleAddNewTaskColumn = () => {
    setData(null);
    setIsVisibleColumn(true);
  };
  const handleOkTaskColumn = async (values) => {
    const {name, description} = values;
    const idColumn = v4();
    listData.push({name, description, id: idColumn, child: []});
    listStatus.push({value: idColumn, label: name});

    domData.dispose();
    setIsVisibleColumn(false);
    setTimeout(() => {
      const domData = smoothDnD(document.getElementById(id), {
        orientation: 'horizontal',
        dragHandleSelector: ".move-drag",
        onDrop: (dropResult) => console.log(dropResult)
      });
      setDomData(domData);
      domListData[idColumn] = smoothDnD(document.getElementById(idColumn), {
        groupName: id,
        getChildPayload: (index) => console.log(index)
      });
    });
  };

  useEffect(() => {
    const domData = smoothDnD(document.getElementById(id), {
      orientation: 'horizontal',
      dragHandleSelector: ".move-drag",
      onDrop: (dropResult) => console.log(dropResult)
    });
    setDomData(domData);

    listData.map(item => {
      listStatus.push({value: item.id, label: item.name});
      domListData[item.id] = smoothDnD(document.getElementById(item.id), {
        groupName: id,
        getChildPayload: (index) => console.log(index)
      });
    });
  }, []);

  const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  };

  const editTask = (item, index, subIndex, status) => {
    setData({...item, index, subIndex, status});
    setIsVisible(true);
  };

  return (
    <Fragment>
      <Button onClick={handleAddNewTask} icon={<i className="las la-lg la-plus-circle" />}>
        Add new Task
      </Button>
      <Button onClick={handleAddNewTaskColumn} icon={<i className="las la-lg la-plus-circle" />}>
        Add new Column
      </Button>
      <ModalForm
        title={!data ? "Add new Task" : "Edit Task"}
        visible={isVisible}
        handleCancel={handleCancel}
        handleOk={handleOkTask}
        columns={task({langPrefix, t, listStatus})}
        loading={isLoading}
        widthLabel={'130px'}
        values={data}
      />
      <ModalForm
        title={!data ? "Add new Column" : "Edit Column"}
        visible={isVisibleColumn}
        handleCancel={handleCancel}
        handleOk={handleOkTaskColumn}
        columns={column({langPrefix, t})}
        loading={isLoading}
        widthLabel={'130px'}
      />
      <div id={id} className='drag-horizontal'>
        {listData.map((item, index) => (
          <Card key={item.id} title={item.name} extra={<i className="move-drag las  la-lg la-arrows-alt" />}>
            <div id={item.id} className="drag-vertical">
              {item.child.map((subItem, subIndex) => (
                <Card key={item.id + subIndex} onClick={() => editTask(subItem, index, subIndex, item.id)}>{subItem.name}</Card>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Fragment>
  );
};
