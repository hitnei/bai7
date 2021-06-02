import React, {useEffect} from 'react';
import {Input, Form, Spin, Button, Select, DatePicker, Checkbox, Radio, InputNumber, Typography, Row, Col, Switch, TreeSelect } from "antd";
import MaskedInput from 'antd-mask-input';
import moment from 'moment';
import Media from './input/media';
import Editor from './input/editor';

import './index.scss';
import {useTranslation} from "react-i18next";

export default ({
  columns, textSubmit, handSubmit, values = {}, form,
  loading = false, widthLabel = null, col = 1
}) => {
  const { t } = useTranslation();
  const langPrefix = 'components.Form';

  const $cols = [...Array(col).keys()];
  let $columns = [];
  columns.filter(item => !!item.formItem).map(item => {
    if (item.formItem && item.formItem.edit && !this.value) {
      return item;
    }
    if (!!item.formItem && item.formItem.type === 'title') {
      if (!$columns) {
        $columns = [[item]];
      } else {
        $columns.push([item]);
      }
    } else if ($columns && $columns.length
      && !!$columns[$columns.length - 1][0]
      && $columns[$columns.length - 1][0].formItem.type === 'title') {
      $columns.push([item]);
    } else {
      if ($columns && $columns.length) {
        $columns[$columns.length - 1].push(item);
      } else {
        if (!$columns) {
          $columns = [[item]];
        } else {
          $columns.push([item]);
        }
      }
    }

    if (item.formItem.type === 'password' && !!item.formItem.confirm) {
      const confirmItem = {
        name: 'confirm' + item.name,
        title: t(langPrefix + '.confirm') + " " + item.title.toLowerCase(),
        formItem: {
          type: 'password',
          rules: [
            {
              type: 'custom',
              validator: ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue(item.name) === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t(langPrefix + '.rulesConfirmPassword'));
                },
              })
            }
          ]
        }
      };
      $columns[$columns.length - 1].push(confirmItem);
    }
  });

  const generateInput = (formItem, name, values) => {
    switch (formItem.type) {
      case 'hidden':
        break;
      case 'media':
        return <Media limit={formItem.limit}/>;
      case "editor":
        return <Editor/>;
      case 'number':
        return <InputNumber
          placeholder={formItem.placeholder}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/(,*)/g, '')}
        />;
      case 'mask':
        return <MaskedInput
          mask={formItem.mask}
          onBlur={(e) => {
            if (e.target.value.indexOf('_') > -1) form.setFieldsValue({[name]: null});
          }}
        />;
      case 'password':
        return <Input.Password placeholder={formItem.placeholder}/>;
      case 'textarea':
        return <Input.TextArea placeholder={formItem.placeholder}/>;
      case 'date':
        return <DatePicker/>;
      case 'date_range':
        return <DatePicker.RangePicker />;
      case 'checkbox':
        return <Checkbox.Group options={formItem.list} />;
      case 'radio':
        return <Radio.Group options={formItem.list} />;
      case 'select':
        return  (
          <Select placeholder={formItem.placeholder} mode={formItem.mode}>
            {formItem && formItem.list.map((item, index) => (
              <Select.Option key={index} value={item.value}>{item.label}</Select.Option>
            ))}
          </Select>
        );
      case 'tree_select':
        return <TreeSelect
          placeholder={formItem.placeholder}
          multiple={formItem.mode === 'multiple'}
          treeData={formItem.list}
        />;
      case 'switch':
        return <Switch
          checkedChildren={<i className="las la-check"/>}
          unCheckedChildren={<i className="las la-times"/>}
          defaultChecked={!!values && values[name] === 1}
        />;
      default:
        return <Input
          placeholder={formItem.placeholder}
          onBlur={(e) => formItem.onBlur && formItem.onBlur(e, form)}
          disabled={formItem.readonly && values[name]}
        />;
    }
  };
  const generateForm = (item, index) => {
    if (!!item.formItem) {
      if (item.formItem.type === 'title') {
        return <Typography.Title key={index} level={4}>{item.title}</Typography.Title>;
      }
      const rules = [];
      if (item.formItem.rules) {
        item.formItem.rules.map(rule => {
          switch (rule.type) {
            case 'required':
              if (!rule.message) {
                rule.message = t(langPrefix + '.rulesRequired');
              }
              rules.push({
                required: true,
                message: rule.message
              });
              break;
            case 'email':
              if (!rule.message) {
                rule.message = t(langPrefix + '.rulesEmail');
              }
              rules.push({
                type: 'email',
                message: rule.message
              });
              break;
            case 'minLength':
              if (!rule.message) {
                rule.message = t(langPrefix + '.ruleMinLength', {min: rule.value});
              }
              rules.push({
                min: rule.value,
                message: rule.message
              });
              break;
            case 'url':
              if (!rule.message) {
                rule.message = t(langPrefix + '.incorrectPathFormat');
              }
              rules.push({
                type: 'url',
                message: rule.message
              });
              break;
            case 'password':
              const min = rule.min ? rule.min - 1 : 0;
              rules.push(() => ({
                validator: async (rule, value) => {
                  if (!!value && value.trim() !== "" && value.length > min) {
                    if (new RegExp(/^(?=.*?[0-9])(?=.*?[A-Z]).*$/).test(value)) return Promise.resolve();
                    else return Promise.reject(t(langPrefix + '.rulePassword'));
                  } else return Promise.resolve();
                },
              }));
              break;
            case 'custom':
              rules.push(rule.validator);
              break;
          }
          return rule;
        });
      }

      const otherProps = { key: index, label: item.title, name: item.name, labelAlign: 'left' };
      if (rules.length) {
        otherProps['rules'] = rules;
      }
      if (widthLabel) {
        otherProps['labelCol'] = {flex: widthLabel};
      }

      if (item.formItem.type === 'switch') {
        otherProps['valuePropName'] = 'checked';
      }
      if (item.formItem.type === 'hidden') {
        otherProps['hidden'] = true;
      }

      return (
        <Form.Item {...otherProps}>
          {generateInput(item.formItem, item.name, values)}
        </Form.Item>
      );
    }
    return null;
  };
  const generateCol = $columns.map(($column, i) => (
    <Row key={i} gutter={12}>
      {$cols.map(($col, j) => {
        return (
          <Col key={j} xs={24} sm={$column.length === 1 ? 24 : 24 / col}>
            {$column.map((column, index) => {
              if (index >= (($column.length / col) * $col) && index <  (($column.length / col) * ($col + 1))) {
                return generateForm(column, index);
              } else {
                return null;
              }
            })}
          </Col>
        );
      })}
    </Row>
  ));

  const handFinish = (values) => {
    columns.map(item => {
      if (item.formItem) {
        switch (item.formItem.type) {
          case 'switch':
            if (typeof values[item.name] === "undefined") {
              values[item.name] = false;
            }
            break;
          default:
            break;
        }
      }
    });
    handSubmit && handSubmit(values);
  };

  columns.map(item => {
    if (item.formItem) {
      switch (item.formItem.type) {
        case 'date':
          if (values[item.name]) {
            values[item.name] = moment(values[item.name]);
          } else if (!!item.formItem.value) {
            values[item.name] = moment(item.value);
          }
          break;
        default:
          if (!!item.value) {
            values[item.name] = item.value;
          }
          break;
      }
    }
  });

  return (
    <Form
      form={form}
      layout={!widthLabel? 'vertical' : 'horizontal'}
      onFinish={handFinish}
      initialValues={{...values}}
    >
      <Spin tip='Loading' spinning={loading}>
        {generateCol}
        {textSubmit && (
          <div className="text-center">
            <Button type='primary' htmlType='submit'>{textSubmit}</Button>
          </div>
        )}
      </Spin>
    </Form>
  );
};
