import React, { useState, useEffect } from "react";
import {Row, Col, Badge, Card} from 'antd';
import MediaManagement from "../../MediaManagement";

export default ({limit = 1, value, onChange}) => {
  const [url, setUrl] = useState(value ? (limit === 1 ? [value] : value) : []);
  const [isVisible, setIsVisible] = useState(false);
  const [indexImage, setIndexImage] = useState(false);

  useEffect(() => {
    setUrl(value ? (limit === 1 ? [value] : value) : []);
  }, [value]);

  const onSelect = (newUrl) => {
    if (indexImage > -1) {
      if (newUrl) {
        url[indexImage] = newUrl;
      } else {
        url.splice(indexImage, 1);
      }
    } else if (newUrl) {
      url.push(newUrl);
    }
    setUrl(url);
    setIsVisible(false);
    if (limit === 1) {
      onChange(newUrl);
    } else {
      onChange(url);
    }
  };

  const renderIcon = (item) => {
    const array = item.split(".");
    switch (array[array.length - 1]) {
      case "pdf":
        return <><i className="las la-file-pdf la-3x"/> <br/> <span className="word-break">{item}</span></>;
      default:
        return item.indexOf(".jpg") > -1
        || item.indexOf(".png") > -1
        || item.indexOf(".svg") > -1
        || item.indexOf(".jpeg") > -1
          ? <img src={item} alt="avatar" style={{width: '100%'}}/>
          : <i className="las la-link la-3x"/>;
    }
  };

  return (
    <Row gutter={[10, 10]}>
      {url.map((item, index) => (
        <Col key={index}>
          <Badge count={<i className="las la-lg la-times-circle" onClick={() => {
            url.splice(index, 1);
            if (url.length > 1) onChange(JSON.stringify(url));
            else onChange(null);
            if (url.length === 0) setUrl([]);
          }}/>}>
            <div className="media-item" onClick={() => {
              setIsVisible(true);
              setIndexImage(index);
            }}>
              {renderIcon(item)}
            </div>
          </Badge>
        </Col>
      ))}
      {url.length < limit && (
        <Col>
          <div className="media-item" onClick={() => {
            setIsVisible(true);
            setIndexImage(-1);
          }}>
            <i className="las la-plus la-3x"/>
          </div>
        </Col>
      )}
      <MediaManagement isVisible={isVisible} onSelect={onSelect} limit={limit - url.length} onHide={() => setIsVisible(false)}/>
    </Row>
  );
};
