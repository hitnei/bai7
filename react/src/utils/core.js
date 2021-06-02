import axios from "axios";
import {message} from "antd";

export const handGetParent = async (url) => {
  const {data} = await axios.get(url);
  const findChildren = (data, children) => {
    if (data.children && data.children.length > 0) {
      for (let i = 0; i < data.children.length; i++) {
        if (data.id === children['parent_id']) {
          data.children.push(children);
          return data.children;
        } else data.children[i].children = findChildren(data.children[i], children);
      }
      return data.children;
    } else if (data.id === children['parent_id']) return [children];
  };
  const newData = [];
  for (let i = 0; i < data.length; i++) {
    if (!data[i]['parent_id'] || data[i]['parent_id'] === '0') {
      data[i].children = [];
      newData.push(data[i]);
    } else {
      newData[newData.length - 1].children = findChildren(newData[newData.length - 1], data[i]);
    }
  }
  return newData;
};

export const handPostParent = async (url, {data, requestDelete}) => {
  const requestPut = [];
  const requestPost = [];
  const loop = async (array) => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].children && array[i].children.length > 0) {
        array[i].children = await loop(array[i].children);
      }
      let dataRequest = {...array[i]};
      delete dataRequest.children;
      if (dataRequest.id.length === 36) {
        requestPut.push(dataRequest);
      } else {
        requestPost.push(dataRequest);
      }
    }
    return array;
  };
  const newData = await loop(data);
  if (requestPut.length > 0) {
    const {data} = await axios.put(url + "all", requestPut);
    if (data.message) message.success(data.message);
  }
  if (requestPost.length > 0) {
    const {data} = await axios.post(url, requestPost);
    if (data.message) message.success(data.message);
  }
  if (requestDelete.length > 0) {
    const {data} = await axios.delete(url + "all", {params: requestDelete});
    if (data.message) message.success(data.message);
  }
  return newData;
};

export const slugify = (text) => {
  text = text.toString().toLowerCase().trim();
  const sets = [
    {to: 'a', from: '[ÀÁÂÃÄÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶἀ]'},
    {to: 'c', from: '[ÇĆĈČ]'},
    {to: 'd', from: '[ÐĎĐÞ]'},
    {to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
    {to: 'g', from: '[ĜĞĢǴ]'},
    {to: 'h', from: '[ĤḦ]'},
    {to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
    {to: 'j', from: '[Ĵ]'},
    {to: 'ij', from: '[Ĳ]'},
    {to: 'k', from: '[Ķ]'},
    {to: 'l', from: '[ĹĻĽŁ]'},
    {to: 'm', from: '[Ḿ]'},
    {to: 'n', from: '[ÑŃŅŇ]'},
    {to: 'o', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
    {to: 'oe', from: '[Œ]'},
    {to: 'p', from: '[ṕ]'},
    {to: 'r', from: '[ŔŖŘ]'},
    {to: 's', from: '[ßŚŜŞŠȘ]'},
    {to: 't', from: '[ŢŤ]'},
    {to: 'u', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
    {to: 'w', from: '[ẂŴẀẄ]'},
    {to: 'x', from: '[ẍ]'},
    {to: 'y', from: '[ÝŶŸỲỴỶỸ]'},
    {to: 'z', from: '[ŹŻŽ]'},
    {to: '-', from: '[·/_,:;\']'}
  ];
  sets.forEach(set => {
    text = text.replace(new RegExp(set.from, 'gi'), set.to);
  });

  return text
    .replace(/\s+/g, '-')    // Replace spaces with -
    // .replace(/[^-a-zа-я\u0370-\u03ff\u1f00-\u1fff]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-')    // Replace multiple - with single -
    .replace(/^-+/, '')      // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};

export const formatTreeSelect = (array) => {
  if (array) {
    return array.map(item => {
      const children = (item.children && item.children.length) ? formatTreeSelect(item.children) : null;
      return {value: item.id, title: item.name, selectable: !(item.children && item.children.length), children};
    });
  }
};

export const convertToFiltersTable = (array) => {
  const _temp = [];
  if (array) {
    const loop = (array) => {
      for (let i = 0; i < array.length; i++) {
        _temp.push({value: array[i].id, label: array[i].name});
        if (array[i].children && array[i].children.length > 0) {
          loop(array[i].children);
        }
      }
    };
    loop(array);
  }
  return _temp;
};

export const pickTextColorBasedOnBgColorAdvanced = (bgColor, lightColor, darkColor) => {
  const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const uiColors = [r / 255, g / 255, b / 255];
  const c = uiColors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  return (L > 0.4) ? darkColor : lightColor;
};
