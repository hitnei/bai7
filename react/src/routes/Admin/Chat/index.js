import React, {useEffect, useState, Fragment} from "react";
import Loading from "../../../components/Loading";
import axios from 'axios';

import {useTranslation} from "react-i18next";
import { RealTimeAPI } from "rocket.chat.realtime.api.rxjs";

import {slugify} from "../../../utils/core";
import {GetUserChat} from './service';
import {useAuth} from "../../../global";
import Chat from "../../../components/Chat";

import * as url from "url";
import moment from "moment";

const urlChat = 'chat.harmonypayment.com';
const instance = axios.create({});
const realTimeAPI = new RealTimeAPI("wss://" + urlChat + "/websocket");
let handleSaveData;
let handleLoadMore;
let getListMessage;
let user;
let returnGetListDiscuss;
let handleLeaveRoom;
let handleArchiveRoom;
let handleNewDiscuss;
const audio = new Audio('/sound/chime.mp3');

export default () => {
  const langPrefix = 'routes.Admin.Chat';
  const { t } = useTranslation();
  const auth = useAuth();

  let [isLoading, setIsLoading] = useState(false);
  let [listChat, setListChat] = useState([]);
  let [listChatId, setListChatId] = useState([]);
  let [listUser, setListUser] = useState([]);
  let [listMessage, setListMessage] = useState([]);
  let [members, setMembers] = useState([]);
  let [files, setFiles] = useState([]);
  let [images, setImages] = useState([]);
  let [threads, setThreads] = useState([]);
  let [threadsId, setThreadsId] = useState([]);
  let [thread, setThread] = useState(null);
  let [selectChat, setSelectChat] = useState(null);
  let [arrayId, setArrayId] = useState([]);
  let [offset, setOffset] = useState(0);
  useEffect(async () => {
    const {data: {data}} = await axios.post('/login', {user: 'duc.nguyen@levinci.org', password: '@Dmin!@#456'});
    instance.defaults.headers.common['X-Auth-Token'] = data.authToken;
    instance.defaults.headers.common['X-User-Id'] = data.userId;
    await getListUser('');

    realTimeAPI.connectToServer();
    realTimeAPI.keepAlive().subscribe();
    realTimeAPI.login("duc.nguyen@levinci.org", "@Dmin!@#456").subscribe(
      (_user) => {
        if (_user.msg === 'added') {
          user = _user;
          const _subscriptions = {};
          realTimeAPI.callMethod("subscriptions/get").subscribe(
            (subscriptions) => {
              subscriptions.result.map(item => _subscriptions[item.rid] = item);
              realTimeAPI.callMethod("rooms/get", {$date: null}).subscribe(
                ({result}) => {
                  result.update.map((item, index) => {
                    if (item._id !== 'GENERAL' && item._id.indexOf('rocket.cats') !== 0) {
                      const _data = getRoom(item, user, instance, _subscriptions[item._id]['unread'], _subscriptions[item._id]['alert'],  _subscriptions[item._id]['archived']);
                      listChat.push(_data);
                    }
                    if (index === result.update.length - 1) {
                      refreshData();
                      // getListMessage(listChat.filter((item) => !item.archived)[0]);
                    }
                  });
                });
            });
          realTimeAPI
            .getSubscription("stream-notify-user", user.id + "/rooms-changed", false)
            .subscribe(async (data) => {
              // console.log("rooms-changed", data, listChatId.indexOf(data.fields.args[1]['_id']) > -1, data.fields.args[0] === 'inserted');
              if (listChatId.indexOf(data.fields.args[1]['_id']) > -1) {
                listChat = listChat.map(item => {
                  if (item.id === data.fields.args[1]['_id']) {
                    if (selectChat && item.id === selectChat.id) {
                      instance.get('/channels.members', {params: {roomId: selectChat.id}}).then(({data}) => setMembers(data.members));
                    }
                    return getRoom(data.fields.args[1], user, instance, item.count, data.fields.args[1]._id !== selectChat.id);
                  }
                   return item;
                });
                refreshData();
              }
              if (data.fields.args[0] === 'inserted'){
                listChat.push(getRoom(data.fields.args[1], user, instance, data.fields.args[1]['unread'], data.fields.args[1]['alert'],  data.fields.args[1]['archived']));
                listChat = [...listChat];
                refreshData();
              }
            });
          realTimeAPI
            .getSubscription("stream-notify-user", user.id + "/subscriptions-changed", false)
            .subscribe((data) => {
              // console.log("subscriptions-changed", data, listChatId.indexOf(data.fields.args[1]['rid']) > -1, !!selectChat && selectChat.id === data.fields.args[1]['rid'], data.fields.args[0] === 'removed');
              if (listChatId.indexOf(data.fields.args[1]['rid']) > -1) {
                // audio.play();
                listChat = listChat.map(item => {
                  if (item.id === data.fields.args[1]['rid']) {
                    item.count = data.fields.args[1]['unread'];
                    item.archived = data.fields.args[1]['archived'];
                    item.disableNotifications = data.fields.args[1]['disableNotifications'];
                  }
                  return item;
                });
                refreshData();
              }
              //
              // if (item.tmid && listMessage[arrayId.indexOf(item.tmid)]['discuss']){
              //   listMessage[arrayId.indexOf(item.tmid)]['discuss'].push(handleAddMessage(item));
              // }
              if (!!selectChat && selectChat.id === data.fields.args[1]['rid']) {
                selectChat.count = data.fields.args[1]['unread'];
                selectChat.archived = data.fields.args[1]['archived'];
                selectChat.disableNotifications = data.fields.args[1]['disableNotifications'];
                setSelectChat(selectChat);
                refreshData();
              }
              if (data.fields.args[0] === 'removed') {
                listChat = listChat.filter((item) => item.id !== data.fields.args[1].rid);
                refreshData();
              }
            });

          setTimeout(async () => {
            //
            // realTimeAPI.callMethod("createPrivateGroup", slugify('Revan 1') + new Date().getTime().toString(), ['duc.nguyen'])
            //   .subscribe(({result}) => {
            //     realTimeAPI.callMethod("saveRoomSettings", result._id, "roomTopic", "Revan 1").subscribe(
            //       (data) => console.log('saveRoomSettings', data));
            //     listChat.unshift({
            //       id: result._id,
            //       title: result.name,
            //       type: 3,
            //       avatar: 'https://' + urlChat + '/avatar/room/' + result._id,
            //       description: '',
            //       date: result._updatedAt.$date,
            //       count: 0,
            //       alert: false,
            //     });
            //   });
          }, 1000);
          handleSaveData = async (users, name) => {
            if (users.length === 1) {
              realTimeAPI
                .callMethod("createDirectMessage", users[0])
                .subscribe(({result}) => {
                  if (listChat.filter((item) => item.type === 1 && item.title === result.usernames[0]).length === 0) {
                    listChat.unshift({
                      id: result.rid,
                      title: result.usernames[0],
                      type: 1,
                      avatar: 'https://' + urlChat + '/avatar/' + result.usernames[0],
                      description: '',
                      date: new Date().getTime(),
                      count: 0,
                      alert: false,
                    });
                    refreshData();
                  }
                });
            } else {
              realTimeAPI
                .callMethod("createChannel", slugify(name) + new Date().getTime().toString(), users, true)
                .subscribe(({result}) => {
                  realTimeAPI
                    .callMethod("saveRoomSettings", result._id, "roomTopic", name)
                    .subscribe();
                  listChat.unshift({
                    id: result._id,
                    title: result.name,
                    type: 2,
                    avatar: 'https://' + urlChat + '/avatar/room/' + result._id,
                    description: '',
                    date: result._updatedAt.$date,
                    count: 0,
                    alert: false,
                  });
                  refreshData();
                });
            }
          };
        }
      }
    );
    returnGetListDiscuss = async (item) => {
      const {data} = await instance.get('/chat.getThreadMessages', {params: {tmid: item.id}});
      item['discuss'] = [];
      data.messages.map(msg => item['discuss'].push(handleAddMessage(msg)));
      thread = item;
      setThread(item);
    };
    handleLoadMore = async () => {
      const _listMessage = [...listMessage];
      const _type = selectChat.type === 2 ? 'channels' : (selectChat.type === 3 ?'groups' : 'im');
      const {data} =  await instance.get(`/${_type}.messages`, {params: {roomId: selectChat.id, offset: offset + 50, count: 50}});
      data.messages.map((item) => {
        if ((item.msg && item.msg.indexOf('[ ](https:') !== 0 && !item.tmid) || item.file) {
          arrayId.unshift(item._id);
          _listMessage.unshift(handleAddMessage(item));
        }
      });
      listMessage = _listMessage;
      setListMessage([..._listMessage]);
      setArrayId([...arrayId]);
      if (data.messages.length > 0) {
        offset += 50;
        setOffset(offset + 50);
      }
    };
    getListMessage = async (room) => {
      if (room.alert) {
        listChat = listChat.map((item) => {
          if (item.id === room.id) {
            item.alert = false;
            room.alert = false;
          }
          return item;
        });
        setListChat([...listChat]);
      }
      setIsLoading(true);
      listMessage = [];
      arrayId = [];
      setSelectChat(room);
      selectChat = room;
      const _type = room.type === 2 ? 'channels' : (room.type === 3 ?'groups' : 'im');
      if (room.type > 1) {
        await instance.post(`/subscriptions.read`, {rid: room.id});
        let response = await instance.get(`/${_type}.members`, {params: {roomId: room.id}});
        setMembers(response.data.members);
        response = await instance.get(`/${_type}.files`, {params: {roomId: room.id}});
        const _images = [];
        const _files = [];
        response.data.files.map(item => item.type.indexOf('image/') === 0 ? _images.push(item) : _files.push(item));
        setFiles(_files);
        setImages(_images);
        response = await instance.get('/chat.getThreadsList', {params: {rid: room.id}});
        threadsId = [];
        threads = response.data.threads.map(item => {
          threadsId.push(item._id);
          return handleAddMessage(item);
        });
        setThreads(threads);
        setThreadsId(threadsId);
      }
      const {data} =  await instance.get(`/${_type}.messages`, {params: {roomId: room.id, offset: 0, count: 50}});
      if (!!data.messages) {
        data.messages.map((item) => {
          if ((item.msg && item.msg.indexOf('[ ](https:') !== 0 && !item.tmid) || item.file) {
            arrayId.unshift(item._id);
            listMessage.unshift(handleAddMessage(item));
          }
        });
        setListMessage([...listMessage]);
        setArrayId([...arrayId]);
        offset = 0;
        setOffset(0);
      }
      setIsLoading(false);
      // realTimeAPI
      //   .getSubscription("stream-notify-room", room.id + "/typing", true)
      //   .subscribe((data) => console.log('stream-notify-room/typing', data));
      realTimeAPI
        .getSubscription("stream-notify-room", room.id + "/deleteMessage", true)
        .subscribe((data) => {
          if (data.fields.args) {
            data.fields.args.map(({_id}) => {
              listMessage = listMessage.filter(({id}) => id !== _id);
              arrayId = arrayId.filter((id) => id !== _id);
            });
            setListMessage([...listMessage]);
            setArrayId([...arrayId]);
          }
        });
      realTimeAPI
        .getSubscription("stream-room-messages", room.id, false)
        .subscribe(({fields}) => {
          // console.log("stream-room-messages", fields, selectChat);
          fields.args.map(async (item) => {
            if ((item.u._id !== user.id && !selectChat.disableNotifications) || (item.msg && item.msg.indexOf('_@_' + user.fields.username +'_@_') > -1)) {
              audio.play();
            }
            if (selectChat && selectChat.id === item.rid && item.msg && item.msg.indexOf('[ ](https:') !== 0 || item.file) {
              if (!item.tmid && arrayId.indexOf(item._id) === -1) {
                arrayId.push(item._id);
                listMessage.push(handleAddMessage(item));
                offset += 1;
                setOffset(offset + 1);
              } else if (item.tmid && listMessage[arrayId.indexOf(item.tmid)] && listMessage[arrayId.indexOf(item.tmid)]['discuss']){
                let _index = -1;
                listMessage[arrayId.indexOf(item.tmid)]['discuss'].map((subItem, subIndex) => {
                  if (_index === -1 && subItem.id === item._id) {
                    _index = subIndex;
                  }
                });
                if (_index === -1) {
                  listMessage[arrayId.indexOf(item.tmid)]['discuss'].push(handleAddMessage(item));
                } else {
                  listMessage[arrayId.indexOf(item.tmid)]['discuss'][_index] = handleAddMessage(item);
                }
              } else if (arrayId.indexOf(item._id) > -1) {
                listMessage[arrayId.indexOf(item._id)].message = item.msg;
                if (item.replies) {
                  listMessage[arrayId.indexOf(item._id)].disableNotifications = item.replies.indexOf(user.id) === -1;
                }
              }
              if (thread && item._id === thread.id) {
                setIsLoading(true);
                thread.discussCount = item.tcount;
                thread.disableNotifications = item.replies.indexOf(user.id) === -1;
                thread.message = item.msg;
                const {data} = await instance.get('/chat.getThreadMessages', {params: {tmid: thread.id}});
                thread['discuss'] = [];
                data.messages.map(msg => thread['discuss'].push(handleAddMessage(msg)));
                setThread(thread);
                setIsLoading(false);
              }
              if (item.tmid && thread && thread.id === item.tmid) {
                thread.discuss = thread.discuss.map(subItem => {
                  if (subItem.id === item._id) {
                    return handleAddMessage(item);
                  }
                  return subItem;
                });
              }
            }
            if (item.tmid && threadsId.length > 0 && threadsId.indexOf(item.tmid) > -1) {
              threads[threadsId.indexOf(item.tmid)].message = item.msg;
              setThreads([...threads]);
            }
          });
          setListMessage([...listMessage]);
          setArrayId([...arrayId]);
        });

    };
    handleLeaveRoom = async (roomId) => {
      selectChat = null;
      setSelectChat(null);
      await instance.post('/channels.leave', {roomId});
    };
    handleArchiveRoom = (roomId, status) => {
      selectChat = null;
      setSelectChat(null);
      if (status) {
        realTimeAPI.callMethod("archiveRoom", roomId);
      } else {
        realTimeAPI.callMethod("unarchiveRoom", roomId);
      }
    };

    handleNewDiscuss = (index, status = true) => {
      if (status) {
        listMessage[index]['discuss'] = [];
      } else {
        listMessage[index]['discuss'] = null;
      }
      setListMessage([...listMessage]);
    };
    return () => {
      realTimeAPI.disconnect();
    };
  }, []);

  const getRoom = (item, user, instance, count, alert, archived, disableNotifications = false) => {
    const {_id, name, topic, lastMessage, usernames, _updatedAt, t, u} = item;
    const _type = t === 'd' ? 1 : (t === 'c' ? 2 : 3);
    const _avatar = _type === 1 ? 'https://' + urlChat + '/avatar/' + (usernames[1] ? usernames[1] : usernames[0]) : 'https://' + urlChat + '/avatar/room/' + _id;
    let _description = '';
    if (lastMessage) {
      let _message = lastMessage.msg;
      if (_message.indexOf('[ ](https:') === 0) {
        _message = _message.split(') ');
        _message[0] = '';
        _message = _message.join('');
      }
      if (_message) {
        _description = (lastMessage.u._id === user.id ? 'You' : lastMessage.u.name) + (arrayId.indexOf(lastMessage._id) > -1 ? " discuss in: " : ": ") + _message;
      }
    }
    let _title = _type === 1 ? (usernames[1] ? usernames[1] : usernames[0]) : (topic ? topic : name);
    // if (_type === 1) {
    //   const {data: {user}} = await instance.get('/users.info', {params: { username:  usernames[1] }});
    //   _title = user.name;
    // }
    return {
      id: _id,
      link: 'https://' + urlChat + '/avatar/',
      title: _title,
      type: _type,
      owner: u && u._id === user.id,
      ownerName: u && u.username,
      avatar: _avatar,
      description: _description,
      date: lastMessage ? lastMessage.ts.$date : _updatedAt.$date,
      count, alert, archived, disableNotifications,
    };
  };
  const refreshData = () => {
    listChat = listChat.sort((a, b) => b.date - a.date);
    setListChat([...listChat]);
    listChatId = listChat.map(item => item.id);
    setListChatId([...listChatId]);
  };
  const getListUser = async (text) => {
    const {data: {users}} = await instance.get('/users.list', {
      params: {
        count: 4,
        sort: JSON.stringify({name: 1}),
        query: JSON.stringify({'username': {'$regex': text}})
      }
    });
    setListUser(users.map(item => {
      item.avatar = 'https://' + urlChat + '/avatar/' + item.username;
      item.id = item._id;
      item.title = item.username;
      return item;
    }));
  };

  const getListDiscuss = async (id) => {
    const {data} = await instance.get('/chat.getThreadMessages', {params: {tmid: id}});
    listMessage[arrayId.indexOf(id)]['discuss'] = [];
    data.messages.map((subItem) => {
      listMessage[arrayId.indexOf(id)]['discuss'].push(handleAddMessage(subItem));
    });
    setListMessage([...listMessage]);
  };
  const handleAddMessage = ({msg, u, _updatedAt, t, _id, tcount = 0, reactions = null, file = null, replies = []}) => {
    return {
      id: _id,
      type: t ? t : (u._id === user.id ? 0 : 1),
      you: u._id === user.id,
      message: file ? file.name : msg,
      name: u.username,
      username: user.fields.username,
      date: moment(_updatedAt?.$date ? _updatedAt.$date : _updatedAt).toDate().getTime(),
      avatar: 'https://' + urlChat + '/avatar/' + u.username,
      yourAvatar: 'https://' + urlChat + '/avatar/' + user.fields.username,
      linkAvatar: 'https://' + urlChat + '/avatar/',
      link: 'https://' + urlChat,
      discussCount: tcount,
      reactions,
      file,
      disableNotifications: replies.indexOf(user.id) === -1
    };
  };
  const handleSendMessage = async (idRoom, message = null, tmid = null, idMessage = null) => {
    if (!tmid) {
      realTimeAPI
        .callMethod("sendMessage", {
          "rid": idRoom,
          "msg": message
        });
    } else if (idMessage) {
      // const {data} = await instance.post('/chat.sendMessage', { message: {
      //     "rid": idRoom,
      //     "_id": idMessage,
      //   }});
      // realTimeAPI
      //   .callMethod("sendMessage", {
      //     "rid": idRoom,
      //     "_id": idMessage
      //   });
    } else {
      const {data} = await instance.post('/chat.sendMessage', { message: {
        "rid": idRoom,
        "msg": message,
        "tmid": tmid,
      }});
    }
  };

  const handleSetReaction = (id, emoji, item) => {
    const _status = !item.reactions || !item.reactions[emoji] || item.reactions[emoji].usernames.indexOf(user.fields.username) === -1;
    realTimeAPI.callMethod("setReaction", emoji, id, _status);
  };
  const handleDeleteMessage = (_id) => {
    realTimeAPI.callMethod("deleteMessage", {_id});
  };
  const handleEditMessage = (_id, msg) => {
    realTimeAPI.callMethod("updateMessage", {_id, msg});
  };

  const handleUpload = async (file, tmid = null) => {
    const formData = new FormData();
    formData.append( "file", file );
    if (tmid) {
      formData.append( "tmid", tmid );
    }
    await instance.post('/rooms.upload/' + selectChat.id, formData, {headers:{'Content-Type':'multipart/form-data'}});
  };

  const handleInviteToRoom = async (userId, roomId) => await instance.post('/channels.invite', {roomId, userId});
  const handleKickToRoom = async (userId, roomId) => await instance.post('/channels.kick', {roomId, userId});

  const handleChangeNameRoom = async (roomId, topic) => await instance.post('/channels.setTopic', {roomId, topic});
  const handleChatToMember = (username) => {
    let indexRoom = -1;
    listChat.map((item, index) => {
      if (indexRoom === -1 && item.type === 1 && item.title === username) {
        indexRoom = index;
      }
    });
    if (indexRoom > -1) {
      getListMessage && getListMessage(listChat[indexRoom]);
    }
  };
  const handleChangeSetting = async (roomId, disableNotifications) => {
    await instance.post('/rooms.saveNotification', {roomId, notifications: { disableNotifications }});
  };


  return <Chat
    isLoading={isLoading}
    listUser={listUser}
    onCreate={handleSaveData}
    listChat={listChat}
    listMessage={listMessage}
    members={members}
    discussions={threads}
    selectChats={selectChat}
    discuss={thread}
    onSearchUser={getListUser}
    onLoadMessage={getListMessage}
    onLoadDiscuss={getListDiscuss}
    onSendMessage={handleSendMessage}
    onSetReaction={handleSetReaction}
    onDeleteMessage={handleDeleteMessage}
    onEditMessage={handleEditMessage}
    onNewDiscuss={handleNewDiscuss}
    onUpload={handleUpload}
    onArchiveRoom={handleArchiveRoom}
    onInviteToRoom={handleInviteToRoom}
    onKickToRoom={handleKickToRoom}
    onLeaveRoom={handleLeaveRoom}
    onChangeNameRoom={handleChangeNameRoom}
    onChatToMember={handleChatToMember}
    returnGetListDiscuss={returnGetListDiscuss}
    onChangeSetting={handleChangeSetting}
    onLoadMore={handleLoadMore}
    files={files} images={images} />;
};
