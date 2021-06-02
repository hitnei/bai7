import React, {useEffect, useState, Fragment} from "react";
import PerfectScrollbar from "perfect-scrollbar";
import { Avatar, Badge, Button, Card, Checkbox, Col, Collapse, Input, List, Modal, Popover, Row, Space, Tooltip, Divider, message, Upload, Spin } from "antd";
import GLightbox from 'glightbox';
import './index.scss';
import moment from "moment";
import 'emoji-mart/css/emoji-mart.css';
import {Picker, Emoji} from 'emoji-mart';
import Loading from "../Loading";
let timerOut;
let timeOutScroll;
let _timerRequest;
let _listMessage = 0;
let _firstHeight = 0;
export default ({
  listChat, listUser, listMessage, selectChats, members, discussions, discuss, returnGetListDiscuss, isLoading, onLoadMore,
  onNewDiscuss, onUpload, onArchiveRoom, onInviteToRoom, onKickToRoom, onLeaveRoom, onChangeNameRoom, onChatToMember,
  onSearchUser, onCreate, onLoadMessage, onLoadDiscuss, onSendMessage, onSetReaction, onDeleteMessage, onEditMessage,
  files, images, onChangeSetting
}) => {
  const filesType = {
    'image/png': 'jpg.svg',
    'image/jpg': 'jpg.svg',
    'application/pdf': 'pdf.svg',
    'image/doc': 'doc.svg',
    'image/html': 'html.svg',
    'javascript': 'javascript.svg',
    'csv': 'csv.svg',
    'mp4': 'mp4.svg',
    'xml': 'xml.svg',
    'zip': 'zip.svg',
  };

  const [_indexSelect, set_indexSelect] = useState(0);
  const [_listUser, set_listUser] = useState([]);
  useEffect(() => {
    set_indexSelect(0);
    set_listUser([{id: -1, title: 'All', avatar: '/svg/chat/info.svg'}, ...listUser]);
  }, [listUser]);

  const [status, setStatus] = useState('chat');
  const [selectChat, setSelectChat] = useState('chat');
  useEffect(() => {
    if (selectChats) {
      listChat.map((item) => {
        if (item.id === selectChats.id) {
          setSelectChat(item);
        }
      });
    }
  }, [listChat]);
  useEffect(() => {
    setSelectChat(selectChats);
  }, [selectChats]);

  const [isVisibleMention, setIsVisibleMention] = useState(false);
  const [isVisibleEditMessage, setIsVisibleEditMessage] = useState(false);
  const [editMessage, setEditMessage] = useState(null);
  const [caretPosition, setCaretPosition] = useState(0);
  const handleSendMessage = (event, id = null) => {
    let _index;
    let _text;
    if (event) {
      _index = _getCarePosition(event);
      _text = event.target.childNodes[_index];
    }

    if (event && event.keyCode === 13 && event.altKey) {
      const test = document.createElement("br");
      test.contentEditable = false;
      const _inputSend = document.getElementById("input_chat" + id);
      let _first = _inputSend.innerHTML.substr(0, caretPosition);
      const _last = _inputSend.innerHTML.substr(caretPosition, _inputSend.innerHTML.length);
      _inputSend.innerHTML = _first + test.outerHTML + (_last.length === 0 ? '&nbsp;' : '') + _last;
      _inputSend.focus();
      const range = document.createRange();
      const numberPlus = caretPositionIndex+2;
      console.log(_inputSend.childNodes,_last,caretPositionIndex,  numberPlus);
      range.setStart(_inputSend, 0);
      range.collapse(true);
      range.setStart(_inputSend.childNodes[numberPlus], 0);
      range.setEnd(_inputSend.childNodes[numberPlus],0);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if(!event || (event.keyCode === 13 && !event.altKey)){
      if ((_text && _text.nodeType === 3 && _text.nodeValue.indexOf('@') > -1)) {
        event.preventDefault();
        handleAddMention(_listUser[_indexSelect].title, id);
      } else {
        const _input = document.getElementById("input_chat" + id);
        let text = '';
        for (let i = 0; i < _input.childNodes.length; i++) {
          if (_input.childNodes[i].nodeName === 'SPAN') {
            const _class = _input.childNodes[i].className;
            if (_class === "emoji-mart-emoji") {
              text += ':' + _input.childNodes[i].ariaLabel.split(", ")[1] + ':';
            } else if (_class === "text_mention") {
              text += '_@_' + _input.childNodes[i].innerText + '_@_';
            } else {
              text += _input.childNodes[i].innerText;
            }
          } else if (_input.childNodes[i].nodeName === 'BR') {
            text += '\n';
          } else {
            text += _input.childNodes[i].data;
          }
        }
        if (!isVisibleEditMessage) {
          onSendMessage(selectChat.id, text, id);
        } else {
          onEditMessage(editMessage.id, text);
          setIsVisibleEditMessage(false);
          set_isLoad(true);
        }
        setTimeout(() => _input.innerHTML = "");
      }

    } else if (!!event) {
      if ((_text && _text.nodeType === 3 && _text.nodeValue.indexOf('@') > -1)) {
        if (event.keyCode === 40 || event.keyCode === 38) {
          let _index = _indexSelect + (event.keyCode === 40 ? 1 : -1);
          if (_index === -1) {
            _index += _listUser.length;
          } else if (_index === _listUser.length) {
            _index = 0;
          }
          set_indexSelect(_index);
        }
      }
      if (_timerRequest) {
        clearTimeout(_timerRequest);
      }
      _timerRequest = setTimeout(() => {
        if ((event.keyCode === 8 && _text && _text.nodeValue.indexOf('@') > -1) || (event.key.length === 1  && (event.key === '@' || (_text && _text.nodeType === 3 && _text.nodeValue.indexOf('@') > -1)))) {
          let _search = '';
          if (_text && _text.nodeValue) {
            _text = _text.nodeValue;
          }
          if (_text && _text.indexOf('@') > -1 && event.key !== '@') {
            const __ = _text.split('@');
            _search = __[__.length - 1];
          }
          if (_search.indexOf('&nbsp;') > -1) {
            _search = _search.replace('&nbsp;', '');
          }

          onSearchUser(_search.toLowerCase());
          setIsVisibleMention(true);
        } else if (isVisibleMention && event.keyCode !== 40 && event.keyCode !== 38) {
          setIsVisibleMention(false);
        }
      }, 500);
    }
  };
  const getCarePosition = (event) => {
    if (timerOut) {
      clearTimeout(timerOut);
    }
    timerOut = setTimeout(() => {
      _getCarePosition(event);
    }, 500);
  };

  const [caretPositionIndex, setCaretPositionIndex] = useState(0);
  const _getCarePosition = (event) => {
    const _sel = window.getSelection();
    let _position = 0;
    let _index = -1;
    let _check = false;
    for (let i = 0; i < event.target.childNodes.length; i++) {
      if (!_check && event.target.childNodes[i] === _sel.focusNode) {
        _check = true;
        const _nodeValue = event.target.childNodes[i].nodeValue.substr(0, _sel.focusOffset);
        const _text = _nodeValue.trim();
        const _numberSpace = _nodeValue.split(" ").length - 1;
        _position += _text.length + ((_nodeValue.length - _text.length) * 6) + (_numberSpace * 6);
        setCaretPositionIndex(i);
        _index = i;
      } else if (!_check) {
        const _node = event.target.childNodes[i];
        if (_node && _node.nodeType === 1) {
          _position += _node.outerHTML.length;
        } else {
          const _text = _node.nodeValue.trim();
          const _numberSpace = _node.nodeValue.split(" ").length - 1;
          _position += _text.length + ((_node.length - _text.length) * 6) + (_numberSpace * 6);
        }
      }
    }
    setCaretPosition(_position);
    return _index;
  };

  const renderInputChat = ({small= false, id = null, value = null}) => (
    <Row className={!small ? "input-chat position_relative" : ""} justify="space-between" align="middle">
      <Fragment>
        {isVisibleMention && (
          <List
            className="list_mention"
            size="small"
            itemLayout="horizontal"
            dataSource={_listUser}
            renderItem={(item, index) => (
              <List.Item key={item.id} onClick={() => handleAddMention(item.title, id)} className={index === _indexSelect && 'active'}>
                <List.Item.Meta
                  avatar={<Avatar size={30} src={item.avatar}/>}
                  title={<span className="hover">{item.title}</span>}
                />
              </List.Item>
            )}
          />
        )}
        <Col flex="1">
          <Upload.Dragger listType='picture' beforeUpload={(file) => !value && onUpload(file, id)} openFileDialogOnClick={false} showUploadList={false}>
            <div className="warp_input_chat">
              <div
                className={'input' + (value ? ' not_upload' : '')}
                dangerouslySetInnerHTML={{__html: renderTextMessage(value ? value : '')}}
                contentEditable={true}
                onPaste={(e) => {
                  e.preventDefault();
                  var text = e.clipboardData.getData("text/plain");
                  document.execCommand("insertHTML", false, text);
                }}
                id={"input_chat" + id}
                onKeyDown={event => handleSendMessage(event, id)}
                onFocus={event => getCarePosition(event)}
                onClick={event => getCarePosition(event)}
              />
              <Space size={small ? 10 : 8}>
                {!value && (
                  <Upload listType='picture' beforeUpload={(file) => onUpload(file, id)} showUploadList={false}>
                    <Button type="text" className="p-0" icon={<i className={"las la-paperclip" + (!small ? " la-2x" : "")}/>}/>
                  </Upload>
                )}
                <Popover
                  overlayClassName="emoji_chat"
                  placement="topRight"
                  title={null}
                  content={<Picker set='apple' perLine={8} emojiTooltip={true} showPreview={false} showSkinTones={false} onClick={(emoji) => {
                    const test = document.createElement("span");
                    test.contentEditable = false;
                    test.innerHTML = Emoji({
                      html: true,
                      set: 'apple',
                      emoji: emoji.id,
                      size: 20,
                    });
                    const _inputSend = document.getElementById("input_chat" + id);
                    const _first = _inputSend.innerHTML.substr(0, caretPosition);
                    const _last = _inputSend.innerHTML.substr(caretPosition, _inputSend.innerHTML.length);
                    _inputSend.innerHTML = _first + '&nbsp;' + test.innerHTML + '&nbsp;' + _last;
                    _inputSend.focus();

                    const range = document.createRange();
                    range.setStart(_inputSend, 0);
                    range.collapse(true);
                    range.setStart(_inputSend.childNodes[caretPositionIndex+2], _inputSend.childNodes[caretPositionIndex+2].nodeValue.length);
                    range.setEnd(_inputSend.childNodes[caretPositionIndex+2], _inputSend.childNodes[caretPositionIndex+2].nodeValue.length);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);

                  }} />}
                  trigger="click"
                  onVisibleChange={visible => {
                    if(visible) {
                      setTimeout(() => {
                        const info = new PerfectScrollbar('.emoji-mart-scroll');
                      }, 1000);
                    }
                  }}
                >
                  <Button type="text" className="p-0" icon={<i className={"las la-smile"  + (!small ? " la-2x" : "")}/>}/>
                </Popover>
              </Space>
            </div>
          </Upload.Dragger>
        </Col>
        {!small && (
          <Col flex="58px">
            <Button className="send" onClick={event => handleSendMessage(null, id)} type="link" icon={<img width="30" src="/svg/chat/send.svg" alt="Send"/>}/>
          </Col>
        )}
      </Fragment>
    </Row>
  );
  const renderReactEmoji = (id, item) => {
    return (
      <Popover
        overlayClassName="emoji_chat"
        placement="topRight"
        title={null}
        content={<Picker set='apple' perLine={8} emojiTooltip={true} showPreview={false} showSkinTones={false} onClick={(emoji) => {
          onSetReaction(id, ':' + emoji.id + ':', item);
        }} />}
        trigger="click"
        onVisibleChange={visible => {
          if(visible) {
            setTimeout(() => {
              const info = new PerfectScrollbar('.emoji-mart-scroll');
            }, 1000);
          }
        }}
      >
        <Button size="small" shape="circle" icon={<i className="las la-smile"/>}/>
      </Popover>
    );
  };
  const renderTextMessage = (message) => {
    const newMessage = message.match(/:+[a-z]+[_|a-z]+[a-z]+:/g);
    if (newMessage && newMessage.length) {
      for(let emoj in newMessage){
        if (newMessage.hasOwnProperty(emoj)) {
          message = message.split(newMessage[emoj]).join(Emoji({
            html: true,
            set: 'apple',
            emoji: newMessage[emoj],
            size: 24,
          }));
        }
      }
    }
    const mention = message.match(/_@_+[a-z]+[.|a-z]+[a-z]+_@_/g);
    if (mention && mention.length) {
      for(let item in mention){
        if (mention.hasOwnProperty(item)) {
          message = message.split(mention[item]).join('<span class="text_mention">' + mention[item].substr(3, mention[item].length - 6) + '</span>');
        }
      }
      return message;
    }
    message = message.replace(/\n/g, '<br/>');
    return message;
  };
  const renderMessage = ({type, message, name, you, file, link, username}) => {
    switch (type) {
      case 'room_changed_privacy':
        return null;
      case 'room_changed_description':
        return <div className="text-center">Room description changed to: <strong>{message}</strong> by <em>{you ? 'You' : name}</em></div>;
      case 'room_changed_announcement':
        return <div className="text-center">Room announcement changed to: <strong>{message}</strong> by <em>{you ? 'You' : name}</em></div>;
      case 'room_changed_topic':
        return <div className="text-center">Room topic changed to: <strong>{message}</strong> by <em>{you ? 'You' : name}</em></div>;
      case 'r':
        return <div className="text-center">Room name changed to: <strong>{message}</strong> by <em>{you ? 'You' : name}</em></div>;
      case 'uj':
        return <div className="text-center"><strong>{you ? 'You' : name}</strong> Has joined the channel.</div>;
      case 'au':
        return <div className="text-center"><strong>{you ? 'You' : name}</strong> added {username === message ? 'You' : message}.</div>;
      case 'ru':
        return <div className="text-center"><strong>{you ? 'You' : name}</strong> removed {username === message ? 'You' : message}.</div>;
      case 'ul':
        return <div className="text-center"><strong>{you ? 'You' : name}</strong> has left the channel.</div>;
      default:
        const prop = !!file && file.type.indexOf('image') > -1 ? {
          className: "glightbox",
          "data-effect": "fade",
          "data-zoomable": "true",
          "data-draggable": "true",
          "data-title": file.name,
          "data-description": file.type,
          "data-desc-position": file.type,
        } : {};
        return !file ? <span>message</span> : <a href={link + '/file-upload/' + file._id + '/' + file.name} {...prop}><i className="las la-paperclip la-lg" /> {file.name}</a>;
    }
  };
  const handleCopyMessage = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "-100%";
    textArea.style.left = "-100%";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      message.success('Copied!');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
  };
  const handleDownload = ({file, link, name}) => {
    let linkDownload = document.createElement('a');
    linkDownload.href = link + (file ? '/file-upload/' + file._id + '/' + file.name : '');
    linkDownload.download = file ? file.name : name;
    document.body.appendChild(linkDownload);
    linkDownload.click();
    setTimeout(() => {
      document.body.removeChild(linkDownload);
    }, 10);
  };
  const handleAddMention = (mention, id) => {
    const test = document.createElement("span");
    test.contentEditable = false;
    test.className = 'text_mention';
    test.innerHTML = mention;
    const _inputSend = document.getElementById("input_chat" + id);
    let _first = _inputSend.innerHTML.substr(0, caretPosition + 1).split('@');
    _first = _first.filter((item, index) => index < _first.length - 1).join('@');
    const _last = _inputSend.innerHTML.substr(caretPosition + 1, _inputSend.innerHTML.length);
    _inputSend.innerHTML = _first + '&nbsp;' + test.outerHTML + '&nbsp;' + _last;
    _inputSend.focus();
    setIsVisibleMention(false);

    const range = document.createRange();
    range.setStart(_inputSend, 0);
    range.collapse(true);
    range.setStart(_inputSend.childNodes[caretPositionIndex+2], _inputSend.childNodes[caretPositionIndex+2].nodeValue.length);
    range.setEnd(_inputSend.childNodes[caretPositionIndex+2], _inputSend.childNodes[caretPositionIndex+2].nodeValue.length);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleArchiveRoom = ({status}) => {
    onArchiveRoom(selectChat.id, status);
  };

  const [_listChat, set_listChat] = useState(listChat);
  const [_searchChat, set_searchChat] = useState('');
  useEffect(() => {
    set_listChat(listChat.filter(item => item.title.toUpperCase().indexOf(_searchChat.toUpperCase()) > -1));
  }, [listChat, _searchChat]);

  const [_members, set_members] = useState(members);
  const [_idMembers, set_idMembers] = useState([]);
  const [_searchMember, set_searchMember] = useState('');
  useEffect(() => {
    set_members(members.filter(item => item.username.toUpperCase().indexOf(_searchMember.toUpperCase()) > -1));
    set_idMembers(members.map(item => item._id));
  }, [members, _searchMember]);

  const [_files, set_files] = useState(files);
  const [_searchFiles, set_searchFiles] = useState('');
  useEffect(() => {
    set_files(files.filter(item => item.name.toUpperCase().indexOf(_searchFiles.toUpperCase()) > -1));
  }, [files, _searchFiles]);

  const [_discussions, set_discussions] = useState(files);
  const [_searchDiscussions, set_searchDiscussions] = useState('');
  useEffect(() => {
    set_discussions(discussions.filter(item => !!item.message).filter(item => item.message.toUpperCase().indexOf(_searchDiscussions.toUpperCase()) > -1));
  }, [discussions, _searchDiscussions]);


  const [isVisibleInfo, setIsVisibleInfo] = useState(false);
  const [_isLoad, set_isLoad] = useState(false);
  const [_isLoading, set_isLoading] = useState(true);

  const showInfo = () => {
    setIsVisibleInfo(!isVisibleInfo);
    setTimeout(() => {
      const info = new PerfectScrollbar('#info');
    });
  };
  useEffect(() => {
    if (selectChat) {
      const _listChat = new PerfectScrollbar('#list-chat');
      const chat = new PerfectScrollbar('#chat');

      if (timeOutScroll) {
        clearTimeout(timeOutScroll);
      }
      timeOutScroll = setTimeout(() => {
        if (listMessage.length) {
          if (_listMessage === 0 || _listMessage !== listMessage.length) {
            document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollHeight - (_listMessage + 2 > listMessage.length ? 0 : _firstHeight);
            _firstHeight += document.querySelector('#chat').scrollHeight - _firstHeight;
            _listMessage = listMessage.length;
          } else {
            set_isLoad(false);
            document.querySelector('#chat').scrollTop = _firstHeight;
          }
        }
      }, 500);
      set_isLoading(false);

      initLightbox();
      return () => {
        _listChat.destroy();
        chat.destroy();
        // info.destroy();
      };
    }
  }, [listMessage]);
  const handleNewDiscuss = (index, status = true) => {
    onNewDiscuss(index, status);
    set_isLoad(true);
    setTimeout(() => document.querySelector('#chat').scrollTop = document.querySelector('#chat').scrollTop + 70, 1000);
  };

  const [listScroll, setListScroll] = useState(null);
  const handleChangeCollapse = (data) => {
    if (isVisibleInfo && data) {
      if (listScroll) {
        listScroll.destroy();
      }
      setTimeout(() => {
        setListScroll(new PerfectScrollbar('#' + data));
      });
      if (data === "list_scroll_3") {
        initLightbox();
      }
    }
  };
  const initLightbox = () => {
    setTimeout(() => {
      const customLightboxHTML = `<div id="glightbox-body" class="glightbox-container">
                <div class="gloader visible"></div>
                <div class="goverlay"></div>
                <div class="gcontainer">
                <div id="glightbox-slider" class="gslider"></div>
                <button class="gnext gbtn" tabindex="0" aria-label="Next" data-customattribute="example">{nextSVG}</button>
                <button class="gprev gbtn" tabindex="1" aria-label="Previous">{prevSVG}</button>
                <button class="gclose gbtn" tabindex="2" aria-label="Close">{closeSVG}</button>
                <div class="glightbox_custom">
                    <button class="gnext gbtn" tabindex="3"><i class="las la-2x la-download"></i> Download</button>
                    <button class="gprev gbtn" tabindex="4" id="forward_lightbox"><i class="las la-2x la-share-square"></i> Forward</button>
                </div>
            </div>
            </div>`;
      const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        lightboxHTML: customLightboxHTML,
      });
      lightbox.on('open', () => {
        const element = document.getElementById('forward_lightbox');
        element.addEventListener("click", () => handleShowForward());
      });
      lightbox.on('open', () => {
        const element = document.getElementById('forward_lightbox');
        element.removeEventListener("click", () => handleShowForward());
      });
    });
  };

  const [isVisibleCreate, setIsVisibleCreate] = useState(false);
  const [dataSelect, setDataSelect] = useState([]);
  const [name, setName] = useState('');
  const [searchName, setSearchName] = useState('');
  const [addStatus, setAddStatus] = useState(true);
  const handleShowCreate = (status = true) => {
    setAddStatus(status);
    setIsVisibleCreate(true);
    setIsVisibleMention(false);
    onSearchUser('');
    setTimeout(() => {
      const _listChat = new PerfectScrollbar('#list_scroll_0');
    },);
  };
  const handleCreate = () => {
    if (addStatus) {
      if (dataSelect.length === 1 || (dataSelect.length > 1 && !!name)) {
        onCreate && onCreate(dataSelect.map(item => item.username), name);
        handleCancelCreate();
      } else {
        message.warning("Please enter the group name");
      }
    } else {

    }
  };
  const handleCancelCreate = () => {
    setDataSelect([]);
    setName('');
    setSearchName('');
    setIsVisibleCreate(false);
    onSearchUser && onSearchUser('');
  };
  const handleChangeUserSelect = (item) => {
    if (dataSelect.filter(data => data.id === item.id).length === 0) {
      dataSelect.push(item);
      setDataSelect(JSON.parse(JSON.stringify(dataSelect)));
      if (dataSelect.length === 6) {
        setTimeout(() => {
          const scrollVertical = new PerfectScrollbar('#scroll_vertical');
        }, );
      }
    } else {
      setDataSelect(dataSelect.filter(data => data.id !== item.id));
    }
  };

  const [isVisibleForward, setIsVisibleForward] = useState(false);
  const [idMessage, setIdMessage] = useState(false);
  const handleShowForward = (id) => {
    setIdMessage(id);
    setIsVisibleForward(true);
    setTimeout(() => {
      const _listChat = new PerfectScrollbar('#list_scroll_01');
    },);
  };
  const forwardMessage = (idRoom) => {
    onSendMessage(idRoom, null, null, setIdMessage);
  };

  const [isVisibleDiscuss, setIsVisibleDiscuss] = useState(false);
  const handleShowDiscuss = async (item) => {
    await returnGetListDiscuss(item);
    setIsVisibleDiscuss(true);
  };
  useEffect(() => {
    if (discuss) {
      setTimeout(() => {
        const _listChat = new PerfectScrollbar('#chat2');
      },);
    }
  }, [discuss]);

  const [_isVisibleName, set_isVisibleName] = useState(false);
  const [_nameGroup, set_nameGroup] = useState('');
  useEffect(() => {
    if (_isVisibleName) {
      set_nameGroup(selectChat.title);
    }
  }, [_isVisibleName]);

  const handleEditMessage = (item) => {
    if ((item.date + 300000) > Date.now()) {
      setIsVisibleEditMessage(true);
      setEditMessage(item);
    }
  };
  const handleDeleteMessage = (item) => {
    if ((item.date + 300000) > Date.now()) {
      onDeleteMessage(item.id);
      set_isLoad(true);
    }
  };
  const handleLoadMore = (e) => {
    if (e.target.scrollTop < 100 && e.target.scrollTop > 0  && e.target.scrollHeight > e.target.clientHeight && !_isLoading) {
      set_isLoading(true);
      onLoadMore();
    }
  };

  return (
    <Fragment>
      <Modal
        title="Edit Message"
        centered
        onCancel={() => setIsVisibleEditMessage(false)}
        footer={null}
        visible={isVisibleEditMessage}
        destroyOnClose={true}
      >
        {renderInputChat({small: false, id: 22, value: editMessage?.message})}
      </Modal>
      <Modal
        title="Change name"
        centered
        onCancel={() => set_isVisibleName(false)}
        visible={_isVisibleName}
        destroyOnClose={true}
        onOk={() => {
          onChangeNameRoom(selectChat.id, _nameGroup);
          set_isVisibleName(false);
        }}
      >
        <Input placeholder="Change name" value={_nameGroup} onChange={({target}) => set_nameGroup(target.value)} />
      </Modal>
      <Modal
        title={(
          <List.Item>
            <List.Item.Meta
              avatar={<i className='las la-2x la-sms'/>}
              title={discuss?.message && <span className="hover" dangerouslySetInnerHTML={{__html: renderTextMessage(discuss?.message)}} />}
              description={moment(discuss?.date).format("DD/MM/yyyy HH:mm") + ' - ' + discuss?.name}
            />
            <Space>
              <Tooltip title={(discuss?.disableNotifications ? 'Mute all' : 'Receive alerts')} destroyTooltipOnHide={{keepParent: false}}>
                <Button
                  className="radius_button"
                  type="link" icon={<i className={'las la-lg la-bell' + (discuss?.disableNotifications ? '-slash' : '')}
                />}/>
              </Tooltip>
              <Tooltip title="Close" destroyTooltipOnHide={{keepParent: false}}>
                <Button className="radius_button" type="link" icon={<i className="las la-times la-lg"/>} onClick={() => setIsVisibleDiscuss(false)}/>
              </Tooltip>
            </Space>
          </List.Item>
        )}
        centered
        footer={null}
        visible={isVisibleDiscuss}
        onCancel={() => setIsVisibleDiscuss(false)}
        closable={false}
        width={600}
        wrapClassName="modal_discuss"
        destroyOnClose={true}
      >
        <Spin spinning={isLoading}>
          <Card className="chat">
            <div id="chat2" className="chat_box chat_box_modal">
              {discuss?.discuss.map(subItem => (
                <Row key={subItem.id} align="middle"
                     className={(subItem.type === 0 ? "comment you" : (subItem.type === 1 ? "comment" : ""))}>
                  <Col flex="35px">
                    <Tooltip
                      mouseLeaveDelay={0}
                      destroyTooltipOnHide={{keepParent: false}}
                      placement="left"
                      title={subItem.name}
                    >
                      <Badge status="success">
                        <Avatar
                          size={25}
                          src={subItem.avatar}
                        />
                      </Badge>
                    </Tooltip>
                  </Col>
                  <Tooltip
                    mouseLeaveDelay={0}
                    destroyTooltipOnHide={{keepParent: false}}
                    placement="top"
                    title={moment(subItem.date).format("DD/MM/yyyy HH:mm")}
                  >
                    <Col flex="1" className="line small">
                      <Badge count={subItem.reactions ? <div>
                        {Object.keys(subItem.reactions).map(key => (
                          <Popover key={key} overlayClassName="bottom_chat" placement="bottom" content={
                            <List size="small">
                              {subItem.reactions[key].usernames.map(username => (
                                <List.Item key={username}>
                                  <List.Item.Meta
                                    avatar={<Avatar size={25} src={subItem.linkAvatar + username}/>}
                                    title={username}
                                  />
                                </List.Item>
                              ))}

                            </List>
                          }>{
                            Emoji({
                              set: 'apple',
                              emoji: key,
                              size: 16,
                            })
                          } {subItem.reactions[key].usernames.length}</Popover>
                        ))}
                      </div> : <div />}>
                        {!subItem.file ? (
                          <div className="text-message" style={{minWidth: (2 * 40) + 'px'}}
                               dangerouslySetInnerHTML={{__html: renderTextMessage(subItem.message)}}/>
                        ): renderMessage(subItem)}
                      </Badge>
                    </Col>
                  </Tooltip>
                  <Col flex="70px" className="action">
                    <Space>
                      {renderReactEmoji(subItem.id)}
                      <Popover trigger='focus' overlayClassName="left_chat" placement="left" content={(
                        <List size="small">
                          {!!subItem.file && (
                            <List.Item onClick={() => handleShowForward(item.id)}>
                              <List.Item.Meta
                                avatar={<i className='las la-lg la-share-square'/>}
                                title={<span className="hover">Forward</span>}
                              />
                            </List.Item>
                          )}
                          {!!subItem.file && (
                            <List.Item>
                              <List.Item.Meta onClick={() => handleDownload(subItem)}
                                              avatar={<i className='las la-lg la-download'/>}
                                              title={<span className="hover">Download</span>}
                              />
                            </List.Item>
                          )}
                          {!subItem.file && (
                            <List.Item onClick={() => handleCopyMessage(subItem.message)}>
                              <List.Item.Meta
                                avatar={<i className='las la-copy la-lg'/>}
                                title={<span className="hover">Copy</span>}
                              />
                            </List.Item>
                          )}
                          {(subItem.you && (subItem.date + 300000) > Date.now()) && (
                            <Fragment>
                              <Divider className="mb-10 mt-10"/>
                              {!subItem.file && (
                                <List.Item onClick={() => handleEditMessage(subItem)}>
                                  <List.Item.Meta
                                    avatar={<i className='las la-edit la-lg'/>}
                                    title={<span className="hover">Edit</span>}
                                  />
                                </List.Item>
                              )}
                              <List.Item onClick={()=> handleDeleteMessage(subItem)}>
                                <List.Item.Meta
                                  avatar={<i className='las la-trash la-lg'/>}
                                  title={<span className="hover">Delete</span>}
                                />
                              </List.Item>
                            </Fragment>
                          )}
                        </List>
                      )}>
                        <Button type="link" size="small"
                                icon={<i className="las la-ellipsis-v la-lg"/>}/>
                      </Popover>
                    </Space>
                  </Col>
                </Row>
              ))}
            </div>
            <div className="p-10">
              {!selectChat?.archived && (
                <Row className="input-chat small">
                  <Col flex="35px">
                    <Avatar size={25}
                            src={discuss?.yourAvatar}/>
                  </Col>
                  <Col flex="450px" className="position_relative">
                    {renderInputChat({small: true, id: discuss?.id})}
                  </Col>
                </Row>
              )}
            </div>
          </Card>
        </Spin>

      </Modal>
      <Modal
        title={addStatus ? "Create Chat" : "Add member to " + selectChat.title }
        centered
        onCancel={handleCancelCreate}
        visible={isVisibleCreate}
        wrapClassName="modal_create_chat"
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={handleCancelCreate}>
            Cancel
          </Button>, addStatus && (
            <Button key="submit" type="primary" onClick={handleCreate} disabled={dataSelect.length === 0}>
              {addStatus ? "Create" : "Add"}
            </Button>
          )
        ]}
      >
        {(dataSelect.length > 1 && addStatus) && (
          <div className="mb-24">
            <h4>Group name</h4>
            <Input value={name} onChange={({target}) => setName(target.value)} />
          </div>
        )}
        {dataSelect.length > 0 && (
          <Fragment>
            <h4>Selected People <sup>({dataSelect.length})</sup></h4>
            <div id="scroll_vertical" className="scroll_vertical">
              <Row style={{minWidth: (dataSelect.length * 90) + 'px'}}>
                {dataSelect.map((item, index) => (
                  <div className="text-center p-5" key={item.id}>
                    <Badge count={<i className="las la-times-circle la-lg"
                                     onClick={() => handleChangeUserSelect(item)}/>}>
                      <Avatar size={40} src={item.avatar}/>
                    </Badge>
                    <div>{item.title}</div>
                  </div>
                ))}
              </Row>
            </div>
          </Fragment>
        )}
        <h4>List People</h4>
        <Input.Search
          value={searchName}
          onChange={({target}) => { onSearchUser && onSearchUser(target.value); setSearchName(target.value); }}
          onSearch={(value) => onSearchUser && onSearchUser(value)}
          className="chat_search" placeholder="Search"/>
        <List
          id="list_scroll_0"
          className="list_scroll"
          size="small"
          itemLayout="horizontal"
          dataSource={listUser}
          renderItem={(item) => (
            <List.Item key={item.id} onClick={() => addStatus && handleChangeUserSelect(item)}>
              <List.Item.Meta
                avatar={<Avatar size={30} src={item.avatar}/>}
                title={<span className="hover">{item.title}</span>}
              />
              {addStatus ? (
                <Checkbox className="mr-5" checked={dataSelect.filter((data) => data.id === item.id).length}/>
              ) : (
                <Button size="small" onClick={() => _idMembers.indexOf(item.id) === -1 && onInviteToRoom(item.id, selectChat.id)}>{_idMembers.indexOf(item.id) === -1 ? 'Add' : "Added"}</Button>
              )}
            </List.Item>
          )}
        />
      </Modal>
      <Modal
        title="Forward to"
        centered
        onCancel={() => setIsVisibleForward(false)}
        footer={null}
        visible={isVisibleForward}
        destroyOnClose={true}
      >
        <Input.Search
          value={searchName}
          onChange={({target}) => { onSearchUser && onSearchUser(target.value); setSearchName(target.value); }}
          onSearch={(value) => onSearchUser && onSearchUser(value)}
          className="chat_search" placeholder="Search"/>
        <List
          id="list_scroll_01"
          className="list_scroll chat"
          size="small"
          itemLayout="horizontal"
          dataSource={_listChat}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Fragment><Avatar size={50} src={item.avatar}/><sup className={(item.type === 1 ? 'online' : ((item.type === 2 ? 'icon group' : 'icon briefcase')))}/></Fragment>}
                title={<span className={'hover'}>{item.title}</span>}
              />
              <Button size="small" onClick={() => forwardMessage(item.id)}>Send</Button>
            </List.Item>
          )}
        />
      </Modal>
      <Card className="chat">
        <Row className="overflow-hidden">
          <Col flex="300px" className="border-right">
            <Space size={10} direction="vertical" style={{width: '100%'}}>
              <Row className="btn_group" justify="space-between">
                <Col>
                  <Button
                    type={status === "chat" ? 'primary' : ''}
                    size="small" onClick={() => setStatus('chat')}
                    icon={<img className="mr-5" height="15"
                               src={`/svg/chat/chat${(status === "chat" ? '_active' : '')}.svg`} alt="Chat"/>}
                  >Chat</Button>
                  <Button
                    type={status === "archive" ? 'primary' : ''}
                    size="small"
                    onClick={() => setStatus('archive')}
                    icon={<img className="mr-5" height="15"
                               src={`/svg/chat/archive${(status === "archive" ? '_active' : '')}.svg`} alt="Archive"/>}
                  >Archive</Button>
                </Col>
                <Col>
                  {status === "chat" && (
                    <Tooltip title="Add">
                      <Button onClick={handleShowCreate} type="link" size="small"
                              icon={<img className="mr-5" height="15" src={`/svg/chat/add-new.svg`} alt="Add New"/>}>
                        New chat
                      </Button>
                    </Tooltip>
                  )}
                </Col>
              </Row>
              <Input.Search
                className="chat_search"
                placeholder="Search"
                onChange={({target}) => set_searchChat(target.value)}
                onSearch={(value) => set_searchChat(value)}
              />
              <List
                id="list-chat"
                className="list-chat"
                itemLayout="horizontal"
                dataSource={_listChat.filter((item) => status === "archive" ? !!item.archived : !item.archived )}
                renderItem={(item, index) => (
                  <List.Item className={selectChat?.id === item.id && 'active'} onClick={() => { onLoadMessage(item); _listMessage = 0; _firstHeight = 0; set_isLoading(true);}}>
                    <List.Item.Meta
                      avatar={<Fragment><Avatar size={40} src={item.avatar}/><sup className={(item.type === 1 ? 'online' : ((item.type === 2 ? 'icon group' : 'icon briefcase')))}/></Fragment>}
                      title={<Badge count={item.count} size="small" offset={[0, -5]}><span className={'hover' + (item.alert ? ' active' : '')}>{item.title}</span><small>{moment(item.date).format("HH:mm a")}</small></Badge>}
                      // description={item.description && <Badge count={item.count} size="small"><small dangerouslySetInnerHTML={{__html: renderTextMessage(item.description)}} /></Badge>}
                    />
                  </List.Item>
                )}
              />
            </Space>
          </Col>
          {!!selectChat ? (
            <Fragment>
              <Col flex="1" className="overflow-hidden">
                <Spin size="large" spinning={_isLoading}>

                  <Row className="main-title" justify="space-between" align="middle">
                    <Col flex="1">
                      <List>
                        <List.Item className="not">
                          <List.Item.Meta
                            avatar={<Fragment>
                              <Avatar size={50} src={selectChat.avatar}/>
                              <sup className={(selectChat.type === 1 ? 'online' : ((selectChat.type === 2 ? 'icon group' : 'icon briefcase')))}/>
                            </Fragment>}
                            title={<span className="hover">{selectChat.title}</span>}
                            description={<small>{'Last seen 3h ago'}</small>}
                          />
                        </List.Item>
                      </List>
                    </Col>
                    <Space>
                      {!selectChat.archived && (
                        <Fragment>
                          <Tooltip title="Call">
                            <Button size="small" type="link" icon={<img width="40" src="/svg/chat/call.svg" alt="Call"/>}/>
                          </Tooltip>
                          <Tooltip title="Call Video">
                            <Button
                              size="small" type="link"
                              icon={<img width="40" src="/svg/chat/call-video.svg" alt="Call"/>}
                            />
                          </Tooltip>
                        </Fragment>
                      )}
                      <Tooltip title="Info">
                        <Button
                          size="small"
                          type="link"
                          icon={<img width="40" src="/svg/chat/info.svg" alt="Call"/>}
                          onClick={showInfo}
                        />
                      </Tooltip>
                    </Space>
                  </Row>
                  <div id="chat" className="chat_box" onScroll={handleLoadMore}>
                    {!isLoading && (
                      <Fragment>
                        {listMessage.map((item, index) => {
                          const className = (item.type === 0 ? "comment you" : (item.type === 1 ? "comment" : ""));
                          return (
                            <Fragment key={item.id}>
                              <Row align="middle" className={className + (item.discussCount ? " mb-1" : "")}>
                                {item.type === 1 && (
                                  <Col flex={typeof item.type === 'number' ? "50px" : "35px"}>
                                    <Tooltip
                                      mouseLeaveDelay={0}
                                      destroyTooltipOnHide={{keepParent: false}}
                                      placement="left"
                                      title={item.name}
                                    >
                                      <Badge status="success">
                                        <Avatar size={typeof item.type === 'number' ? 40 : 25} src={item.avatar}/>
                                      </Badge>
                                    </Tooltip>
                                  </Col>
                                )}
                                <Tooltip
                                  mouseLeaveDelay={0}
                                  destroyTooltipOnHide={{keepParent: false}}
                                  placement="left"
                                  title={moment(item.date).format("DD/MM/yyyy HH:mm")}
                                >
                                  <Col flex="1" className={"line" + (typeof item.type !== 'number' ? ' info' : '')}>
                                    {typeof item.type === 'number' && !item.file ? (
                                      <Badge count={item.reactions ? <div>
                                        {Object.keys(item.reactions).map(key => (
                                          <Popover trigger='focus' key={key} overlayClassName="bottom_chat" placement="bottom" content={
                                            <List size="small">
                                              {item.reactions[key].usernames.map(username => (
                                                <List.Item key={username}>
                                                  <List.Item.Meta
                                                    avatar={<Avatar size={25} src={item.linkAvatar + username}/>}
                                                    title={username}
                                                  />
                                                </List.Item>
                                              ))}

                                            </List>
                                          }>{
                                            Emoji({
                                              set: 'apple',
                                              emoji: key,
                                              size: 16,
                                            })
                                          } {item.reactions[key].usernames.length}</Popover>
                                        ))}
                                      </div> : <div />}>
                                        <div className="text-message" style={{minWidth: ((item.reactions ? Object.keys(item.reactions).length : 1) * 40) + 'px'}}
                                             dangerouslySetInnerHTML={{__html: renderTextMessage(item.message)}}/>
                                      </Badge>
                                    ) : renderMessage(item)}
                                  </Col>
                                </Tooltip>
                                {typeof item.type === 'number' && (
                                  <Col flex="150px" className="action">
                                    <Space>
                                      {renderReactEmoji(item.id, item)}
                                      <Popover trigger='focus' overlayClassName="left_chat" placement="left" content={(
                                        <List size="small">
                                          {(item.discussCount === 0 && selectChat.type > 1) && (
                                            <List.Item onClick={() => handleNewDiscuss(index)}>
                                              <List.Item.Meta
                                                avatar={<i className='las la-sms la-lg'/>}
                                                title={<span className="hover">Discussion</span>}
                                              />
                                            </List.Item>
                                          )}
                                          {!!item.file && (
                                            <List.Item onClick={() => handleShowForward(item.id)}>
                                              <List.Item.Meta
                                                avatar={<i className='las la-lg la-share-square'/>}
                                                title={<span className="hover">Forward</span>}
                                              />
                                            </List.Item>
                                          )}
                                          {!!item.file && (
                                            <List.Item onClick={() => handleDownload(item)}>
                                              <List.Item.Meta
                                                avatar={<i className='las la-lg la-download'/>}
                                                title={<span className="hover">Download</span>}
                                              />
                                            </List.Item>
                                          )}
                                          {!item.file && (
                                            <List.Item onClick={() => handleCopyMessage(item.message)}>
                                              <List.Item.Meta
                                                avatar={<i className='las la-copy la-lg'/>}
                                                title={<span className="hover">Copy</span>}
                                              />
                                            </List.Item>
                                          )}
                                          {(item.you && (item.date + 300000) > Date.now()) && (
                                            <Fragment>
                                              <Divider className="mb-10 mt-10" />
                                              {!item.file && (
                                                <List.Item onClick={() => handleEditMessage(item)}>
                                                  <List.Item.Meta
                                                    avatar={<i className='las la-edit la-lg'/>}
                                                    title={<span className="hover">Edit</span>}
                                                  />
                                                </List.Item>
                                              )}
                                              <List.Item onClick={()=> handleDeleteMessage(item)}>
                                                <List.Item.Meta
                                                  avatar={<i className='las la-trash la-lg'/>}
                                                  title={<span className="hover">Delete</span>}
                                                />
                                              </List.Item>
                                            </Fragment>
                                          )}
                                        </List>
                                      )}>
                                        <Button type="link" size="small" icon={<i className="las la-ellipsis-v la-lg"/>}/>
                                      </Popover>
                                    </Space>
                                  </Col>
                                )}
                              </Row>
                              {(item.discussCount > 0 || item.discuss) && (
                                <Row align="middle" className={className}>
                                  <Col flex={item.type === 0 ? "20px" : "70px"}/>
                                  <Col flex="1">
                                    <Collapse
                                      defaultActiveKey={item.discuss?.length === 0 ? item.id: null}
                                      expandIconPosition="left"
                                      bordered={false}
                                      expandIcon={({isActive}) => {
                                        if (!_isLoad) {
                                          if (!isActive && !!item.discuss && item.discuss.length === 0) {
                                            handleNewDiscuss(index, false);
                                          }
                                          if (isActive && !item.discuss) {
                                            set_isLoad(true);
                                            onLoadDiscuss(item.id);
                                          }
                                        }
                                        return (
                                          <div>
                                            <Space>
                                              <i className={'las la-undo la-lg ' + (isActive ? 'la-rotate-90' : 'la-rotate-180')}/>
                                              <span>{isActive ? 'Hide' : !!item.discuss ? item.discuss.length : item.discussCount} discuss</span>
                                            </Space>
                                          </div>
                                        );
                                      }}
                                    >
                                      <Collapse.Panel key={item.id} header={(
                                        <Tooltip title={(item.disableNotifications ? 'Mute all' : 'Receive alerts')} destroyTooltipOnHide={{keepParent: false}}>
                                          <Button
                                            size="small"
                                            type="link"
                                            icon={<i className={'las la-bell' + (item.disableNotifications ? '-slash' : '')} />}
                                            onClick={() => onChangeSetting(item.id, item.disableNotifications ? '0' : '1')}
                                          />
                                        </Tooltip>
                                      )}>
                                        { !item.discuss && (<Loading />)}
                                        { !!item.discuss && (
                                          <Fragment>
                                            {item.discuss.map(subItem => (
                                              <Row key={subItem.id} align="middle"
                                                   className={(subItem.type === 0 ? "comment you" : (subItem.type === 1 ? "comment" : ""))}>
                                                <Col flex="35px">
                                                  <Tooltip
                                                    mouseLeaveDelay={0}
                                                    destroyTooltipOnHide={{keepParent: false}}
                                                    placement="left"
                                                    title={subItem.name}
                                                  >
                                                    <Badge status="success">
                                                      <Avatar
                                                        size={25}
                                                        src={subItem.avatar}
                                                      />
                                                    </Badge>
                                                  </Tooltip>
                                                </Col>
                                                <Tooltip
                                                  mouseLeaveDelay={0}
                                                  destroyTooltipOnHide={{keepParent: false}}
                                                  placement="top"
                                                  title={moment(subItem.date).format("DD/MM/yyyy HH:mm")}
                                                >
                                                  <Col flex="1" className="line small">
                                                    <Badge count={subItem.reactions ? <div>
                                                      {Object.keys(subItem.reactions).map(key => (
                                                        <Popover key={key} overlayClassName="bottom_chat" placement="bottom" content={
                                                          <List size="small">
                                                            {subItem.reactions[key].usernames.map(username => (
                                                              <List.Item key={username}>
                                                                <List.Item.Meta
                                                                  avatar={<Avatar size={25} src={subItem.linkAvatar + username}/>}
                                                                  title={username}
                                                                />
                                                              </List.Item>
                                                            ))}

                                                          </List>
                                                        }>{
                                                          Emoji({
                                                            set: 'apple',
                                                            emoji: key,
                                                            size: 16,
                                                          })
                                                        } {subItem.reactions[key].usernames.length}</Popover>
                                                      ))}
                                                    </div> : <div />}>
                                                      {!subItem.file ? (
                                                        <div className="text-message" style={{minWidth: (2 * 40) + 'px'}}
                                                             dangerouslySetInnerHTML={{__html: renderTextMessage(subItem.message)}}/>
                                                      ): renderMessage(subItem)}
                                                    </Badge>
                                                  </Col>
                                                </Tooltip>
                                                <Col flex="70px" className="action">
                                                  <Space>
                                                    {renderReactEmoji(subItem.id)}
                                                    <Popover trigger='focus' overlayClassName="left_chat" placement="left" content={(
                                                      <List size="small">
                                                        {!!subItem.file && (
                                                          <List.Item onClick={() => handleShowForward(item.id)}>
                                                            <List.Item.Meta
                                                              avatar={<i className='las la-lg la-share-square'/>}
                                                              title={<span className="hover">Forward</span>}
                                                            />
                                                          </List.Item>
                                                        )}
                                                        {!!subItem.file && (
                                                          <List.Item>
                                                            <List.Item.Meta onClick={() => handleDownload(subItem)}
                                                                            avatar={<i className='las la-lg la-download'/>}
                                                                            title={<span className="hover">Download</span>}
                                                            />
                                                          </List.Item>
                                                        )}
                                                        {!subItem.file && (
                                                          <List.Item onClick={() => handleCopyMessage(subItem.message)}>
                                                            <List.Item.Meta
                                                              avatar={<i className='las la-copy la-lg'/>}
                                                              title={<span className="hover">Copy</span>}
                                                            />
                                                          </List.Item>
                                                        )}
                                                        {(subItem.you && (subItem.date + 300000) > Date.now()) && (
                                                          <Fragment>
                                                            <Divider className="mb-10 mt-10"/>
                                                            {!subItem.file && (
                                                              <List.Item onClick={() => handleEditMessage(subItem)}>
                                                                <List.Item.Meta
                                                                  avatar={<i className='las la-edit la-lg'/>}
                                                                  title={<span className="hover">Edit</span>}
                                                                />
                                                              </List.Item>
                                                            )}
                                                            <List.Item onClick={()=> handleDeleteMessage(subItem)}>
                                                              <List.Item.Meta
                                                                avatar={<i className='las la-trash la-lg'/>}
                                                                title={<span className="hover">Delete</span>}
                                                              />
                                                            </List.Item>
                                                          </Fragment>
                                                        )}
                                                      </List>
                                                    )}>
                                                      <Button type="link" size="small"
                                                              icon={<i className="las la-ellipsis-v la-lg"/>}/>
                                                    </Popover>
                                                  </Space>
                                                </Col>
                                              </Row>
                                            ))}
                                            {!selectChat.archived && (
                                              <Row className="input-chat small">
                                                <Col flex="35px">
                                                  <Avatar size={25}
                                                          src={item.yourAvatar}/>
                                                </Col>
                                                <Col flex="450px" className="position_relative">
                                                  {renderInputChat({small: true, id: item.id})}
                                                </Col>
                                              </Row>
                                            )}
                                          </Fragment>
                                        )}
                                      </Collapse.Panel>
                                    </Collapse>
                                  </Col>
                                </Row>
                              )}
                            </Fragment>
                          );
                        })}
                        {listMessage.length === 0 && <div className="text-center">There are no messages</div>}
                      </Fragment>
                    )}

                  </div>

                  {!selectChat.archived ? renderInputChat({small: false, id: null}) : (
                    <Row className="input-chat position_relative" justify="space-between" align="middle">
                      <Col flex="1">
                        <Button block className="send" type="link" icon={<i className="las la-undo-alt la-2x"/>} onClick={() => handleArchiveRoom({status: false})}>
                          Do you want to make this chat system work?
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Spin>
              </Col>
              <div id="info" className={"border-left" + (isVisibleInfo ? ' active' : '')}>
                <Spin size="large" spinning={_isLoading}>
                  <div className="text-right">
                    {
                      selectChat.type === 2 && (
                        <Tooltip title="Add member" onClick={() => handleShowCreate(false)}>
                          <Button type="link" icon={<i className="las la-2x la-user-plus"/>}/>
                        </Tooltip>
                      )
                    }
                    <Tooltip title={(selectChats?.disableNotifications ? 'On Mute' : 'Off Mute')}>
                      <Button
                        type="link"
                        icon={<i className={'las la-2x la-bell' + (selectChats?.disableNotifications ? '-slash' : '')}/>}
                        onClick={() => onChangeSetting(selectChats.id, selectChats?.disableNotifications ? '0' : '1')}
                      />
                    </Tooltip>
                    <Popover trigger='focus' overlayClassName="left_top_chat" placement="leftTop" content={(
                      <List size="small">

                        {selectChat.type > 1 && (
                          <Fragment>
                            <List.Item>
                              <List.Item.Meta
                                avatar={<i className='las la-lg la-image'/>}
                                title={<span className="hover">Change Avatar</span>}
                              />
                            </List.Item>
                            {(selectChat.type === 2 && selectChat.owner) && (
                              <List.Item onClick={() => set_isVisibleName(true)}>
                                <List.Item.Meta
                                  avatar={<i className='las la-lg la-signature'/>}
                                  title={<span className="hover">Change Name</span>}
                                />
                              </List.Item>
                            )}
                            {(selectChat.type === 2 && !selectChat.owner) && (
                              <List.Item onClick={() => onLeaveRoom(selectChat.id)}>
                                <List.Item.Meta
                                  avatar={<i className='las la-lg la-sign-out-alt'/>}
                                  title={<span className="hover">Leave group</span>}
                                />
                              </List.Item>
                            )
                            }
                          </Fragment>
                        )}
                        {!selectChat.archived && (
                          <List.Item onClick={() => handleArchiveRoom({status: true})}>
                            <List.Item.Meta
                              avatar={<i className='las la-lg la-archive'/>}
                              title={<span className="hover">Archive This Chat</span>}
                            />
                          </List.Item>
                        )}
                      </List>
                    )}>
                      <Button type="link" icon={<i className="las la-2x la-cog"/>}/>
                    </Popover>
                  </div>
                  <div className="text-center">
                    <Space direction="vertical" style={{width: '100%'}}>
                      <div style={{position: "relative", width: '100px', margin: '0 auto'}}>
                        <Avatar size={100}
                                src={selectChat.avatar}/>
                        <sup className={(selectChat.type === 1 ? 'online' : ((selectChat.type === 2 ? 'icon group' : 'icon briefcase')))}/>

                      </div>

                      <h2>{selectChat.title}</h2>
                    </Space>
                  </div>
                  {selectChat.type > 1 && (
                    <Space direction="vertical" style={{width: '100%'}}>
                      <div><strong>Creator:</strong> {selectChat.ownerName}</div>
                      {selectChat.type === 3 && (
                        <Fragment>
                          <div><strong>Project Manager:</strong> Nguyễn Văn X</div>
                          <div><strong>Client:</strong> Levinci</div>
                        </Fragment>
                      )}
                      {selectChat.type === 2 && (
                        <div><strong>Created at:</strong> 14:52, 12/11/2020</div>
                      )}
                      <div><strong>{selectChat.type === 3 ? 'Team' : 'Group'} member:</strong> {members.length}</div>
                    </Space>
                  )}

                  <Collapse
                    className="accordion-list"
                    accordion
                    expandIconPosition="right"
                    bordered={false}
                    onChange={handleChangeCollapse}>
                    {selectChat.type > 1 && (
                      <Fragment>
                        <Collapse.Panel header="Team member" key="list_scroll_1">
                          <Space direction="vertical" style={{width: '100%'}}>
                            <Input.Search
                              className="chat_search"
                              placeholder="Search"
                              onChange={({target}) => set_searchMember(target.value)}
                              onSearch={(value) => set_searchMember(value)}
                            />
                            <List
                              id="list_scroll_1"
                              className="list_scroll"
                              size="small"
                              itemLayout="horizontal"
                              dataSource={_members}
                              renderItem={(item) => (
                                <List.Item>
                                  <List.Item.Meta
                                    avatar={<Avatar size={30} src={selectChat.link + item.username}/>}
                                    title={<span className="hover">{item.username}</span>}
                                  />
                                  <Popover trigger='focus' overlayClassName="left_chat" placement="left" content={(
                                    <List size="small">
                                      <List.Item onClick={() => onChatToMember(item.username)}>
                                        <List.Item.Meta
                                          avatar={<i className='las la-lg la-comment'/>}
                                          title={<span className="hover">Chat</span>}
                                        />
                                      </List.Item>
                                      {selectChat.type === 2 && (
                                        <List.Item onClick={() => onKickToRoom(item._id, selectChat.id)}>
                                          <List.Item.Meta
                                            avatar={<i className='las la-lg la-user-times'/>}
                                            title={<span className="hover">Remove</span>}
                                          />
                                        </List.Item>
                                      )}
                                    </List>
                                  )}>
                                    <Button type="link" size="small" icon={<i className="las la-ellipsis-v"/>}/>
                                  </Popover>
                                </List.Item>
                              )}
                            />
                          </Space>
                        </Collapse.Panel>
                        <Collapse.Panel header="Shared file" key="list_scroll_2">
                          <Space direction="vertical" style={{width: '100%'}}>
                            <Input.Search
                              className="chat_search"
                              placeholder="Search"
                              onChange={({target}) => set_searchFiles(target.value)}
                              onSearch={(value) => set_searchFiles(value)}
                            />
                            <List
                              id="list_scroll_2"
                              className="list_scroll"
                              size="small"
                              itemLayout="horizontal"
                              dataSource={_files}
                              renderItem={(item) => (
                                <List.Item>
                                  <List.Item.Meta
                                    avatar={<img width="30" src={'/svg/files/' + (filesType[item.type] ? filesType[item.type] : 'xml.svg')} alt={item.name}/>}
                                    title={(
                                      <Popover placement="top" content={(
                                        <div className="p-10">
                                          <strong>{item.name}</strong><br/>
                                          <span>Size: {item.size/100000} Mbs</span> <br/>
                                          <span>Upload by: {item.user.username}</span> <br/>
                                          <span>Time: {moment(item._updatedAt).format("DD/MM/yyyy HH:mm")}</span>
                                        </div>
                                      )}>
                                        <span className="hover">{item.name}</span>
                                      </Popover>
                                    )}
                                  />
                                  <Popover trigger='focus' overlayClassName="left_chat" placement="left" content={(
                                    <List size="small">
                                      <List.Item onClick={() => handleDownload({file: null, link: item.url, name: item.name},)}>
                                        <List.Item.Meta
                                          avatar={<i className='las la-lg la-download'/>}
                                          title={<span className="hover">Download</span>}
                                        />
                                      </List.Item>
                                      <List.Item onClick={handleShowForward}>
                                        <List.Item.Meta
                                          avatar={<i className='las la-lg la-share-square'/>}
                                          title={<span className="hover">Forward</span>}
                                        />
                                      </List.Item>
                                    </List>
                                  )}>
                                    <Button type="link" size="small" icon={<i className="las la-ellipsis-v"/>}/>
                                  </Popover>
                                </List.Item>
                              )}
                            />
                          </Space>
                        </Collapse.Panel>
                      </Fragment>
                    )}
                    <Collapse.Panel header="Shared image" key="list_scroll_3">
                      <List
                        id="list_scroll_3"
                        className="list_scroll"
                        size="small"
                        grid={{gutter: 0, column: 3}}
                        itemLayout="horizontal"
                        dataSource={images}
                        renderItem={(item) => (
                          <Popover trigger='focus'  placement="top" content={(
                            <Fragment>
                              <div className="p-10 pb-0">
                                <strong>{item.name}</strong><br/>
                                <span>Size: {item.size/100000} Mb</span> <br/>
                                <span>Upload by: {item.user.username}</span> <br/>
                                <span>Time: {moment(item._updatedAt).format("DD/MM/yyyy HH:mm")}</span>
                              </div>
                              <div>
                                <Button
                                  className="button_text"
                                  size="small"
                                  type="link"
                                  icon={<i className="las la-download"/>}
                                  onClick={() => handleDownload({file: null, link: item.url, name: item.name},)}
                                >
                                  Download
                                </Button>
                                <Button
                                  className="button_text"
                                  size="small"
                                  type="link"
                                  icon={<i className="las la-share-square"/>}
                                  onClick={handleShowForward}
                                >
                                  Forward
                                </Button>
                              </div>
                            </Fragment>
                          )}>
                            <List.Item>
                              <a
                                className="glightbox"
                                href={item.url}
                                data-effect="fade"
                                data-zoomable="true"
                                data-draggable="true"
                                data-title={item.name}
                                data-description={moment(item._updatedAt).format("DD/MM/yyyy HH:mm") + ' ' + (item.size/100000) + 'Mb'}
                                data-desc-position="bottom"
                              >
                                <img
                                  style={{width: '100%'}}
                                  src={item.url}
                                />
                              </a>
                            </List.Item>
                          </Popover>
                        )}
                      />
                    </Collapse.Panel>
                    {/*<Collapse.Panel header="Links" key="list_scroll_4">*/}
                    {/*  <Space direction="vertical" style={{width: '100%'}}>*/}
                    {/*    <Input.Search className="chat_search" placeholder="Search"/>*/}
                    {/*    <List*/}
                    {/*      id="list_scroll_4"*/}
                    {/*      className="list_scroll"*/}
                    {/*      size="small"*/}
                    {/*      itemLayout="horizontal"*/}
                    {/*      dataSource={files}*/}
                    {/*      renderItem={(item) => (*/}
                    {/*        <List.Item>*/}
                    {/*          <List.Item.Meta*/}
                    {/*            avatar={<i className={'las la-lg la-link'}/>}*/}
                    {/*            title={<span className="hover">https://{item.name}</span>}*/}
                    {/*            description={<small>1/14/2021 16:39 - Nguyễn Văn X</small>}*/}
                    {/*          />*/}
                    {/*          <Popover overlayClassName="left_chat" placement="left" content={(*/}
                    {/*            <List size="small">*/}
                    {/*              <List.Item onClick={handleShowForward}>*/}
                    {/*                <List.Item.Meta*/}
                    {/*                  avatar={<i className='las la-lg la-share-square'/>}*/}
                    {/*                  title={<span className="hover">Forward</span>}*/}
                    {/*                />*/}
                    {/*              </List.Item>*/}
                    {/*              <List.Item>*/}
                    {/*                <List.Item.Meta*/}
                    {/*                  avatar={<i className='las la-lg la-copy'/>}*/}
                    {/*                  title={<span className="hover">Copy</span>}*/}
                    {/*                />*/}
                    {/*              </List.Item>*/}
                    {/*            </List>*/}
                    {/*          )}>*/}
                    {/*            <Button type="link" size="small" icon={<i className="las la-ellipsis-v"/>}/>*/}
                    {/*          </Popover>*/}
                    {/*        </List.Item>*/}
                    {/*      )}*/}
                    {/*    />*/}
                    {/*  </Space>*/}
                    {/*</Collapse.Panel>*/}
                    <Collapse.Panel header="Discuss" key="list_scroll_5">
                      <Space direction="vertical" style={{width: '100%'}}>
                        <Input.Search
                          className="chat_search"
                          placeholder="Search"
                          onChange={({target}) => set_searchDiscussions(target.value)}
                          onSearch={(value) => set_searchDiscussions(value)}
                        />
                        <List
                          id="list_scroll_5"
                          className="list_scroll"
                          size="small"
                          itemLayout="horizontal"
                          dataSource={_discussions}
                          renderItem={(item) => (
                            <List.Item onClick={() => handleShowDiscuss(item)}>
                              <List.Item.Meta
                                title={<span className="hover" dangerouslySetInnerHTML={{__html: renderTextMessage(item.message)}} />}
                                description={<small>{moment(item.date).format("DD/MM/yyyy HH:mm") + ' - ' + item.name}</small>}
                              />
                              <Badge size="small" count={item.discussCount} offset={[-17, -3]}>
                                <i className="las la-sms la-lg"/>
                              </Badge>
                            </List.Item>
                          )}
                        />
                      </Space>
                    </Collapse.Panel>
                  </Collapse>
                </Spin>
              </div>
            </Fragment>
          ) : (
            <Col flex="1">
              Bank
            </Col>
          )}
        </Row>
      </Card>
    </Fragment>
  );
};
