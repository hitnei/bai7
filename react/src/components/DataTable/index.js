import React, { useRef, Fragment, useEffect } from "react";
import {Table, Input, Button, Radio, Checkbox, DatePicker, Row} from 'antd';
import moment from 'moment';
import { useHistory } from 'react-router';
import {stringify, parse} from "query-string";

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

import './index.scss';
import {useTranslation} from "react-i18next";

export default ({columns, loading = false, onChange, leftHeader, rightHeader, dataSource = [], total = 0, save = true}) => {
  const { t } = useTranslation();
  const langPrefix = 'components.Datatable';

  useEffect(() => {
    if (save) {
      onChange && onChange({
        page: params.pageIndex, per_page: params.pageSize, sorts: params.sort, filters: params.filters
      });
    }
  }, []);

  let filter = {};
  const groupButton = (confirm, clearFilters, key, value) => (
    <Row justify="space-between">
      <Button onClick={() => {
        delete filter[key];
        clearFilters();
      }}>
        {t(langPrefix + '.reset')}
      </Button>
      <Button
        type="primary"
        onClick={() => {
          filter[key] = value;
          confirm(value);
        }}
        icon={<i className="las la-search" />}
      >
        {t(langPrefix + '.search')}
      </Button>
    </Row>
  );
  const ref = useRef();
  const getColumnSearchInput = (key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <Input
          ref={ref}
          placeholder={t(langPrefix + '.pleaseEnterValueToSearch')}
          value={selectedKeys}
          onChange={e => setSelectedKeys(e.target.value)}
          onPressEnter={() => {
            filter[key] = selectedKeys;
            confirm();
          }}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: filtered => (
      <i className="las la-search" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => ref.current.select());
      }
    }
  });
  const getColumnSearchRadio = (filters, key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, }) => (
      <Fragment>
        <RadioGroup
          options={filters}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value + "")}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: filtered => (
      <i className="las la-dot-circle" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });
  const getColumnSearchCheckbox = (filters, key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <CheckboxGroup
          options={filters}
          value={selectedKeys}
          onChange={e => setSelectedKeys(e)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: filtered => (
      <i className="las la-check-square" style={{ color: filtered ? '#3699FF' : undefined }} />
    ),
  });
  const getColumnSearchDate = (key) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <Fragment>
        <RangePicker
          format={['DD/MM/YYYY', 'DD/MM/YY']}
          value={!!selectedKeys && selectedKeys.length ? [moment(selectedKeys[0]), moment(selectedKeys[1])] : []}
          onChange={e => setSelectedKeys(e)}
        />
        {groupButton(confirm, clearFilters, key, selectedKeys)}
      </Fragment>
    ),
    filterIcon: filtered => (
      <i className="las la-calendar" style={{ color: filtered ? '#3699FF' : undefined }} />
    )
  });
  const history = useHistory();
  const params = history.location.search
    ? parse(history.location.search)
    : { pageIndex: 1, pageSize: 10, filters: '{}', sort: '{"updated_at":"descend"}' } ;
  params.filters = JSON.parse(params.filters);
  if (params.sort) { params.sort = JSON.parse(params.sort); }
  if (params.filters.fullTextSearch) { filter.fullTextSearch = params.filters.fullTextSearch; }

  const cols = columns.filter(col => !!col.tableItem).map(col => {
    let item = col.tableItem;

    if (item.filter) {
      switch (item.filter.type) {
        case "radio":
          item = {...item, ...getColumnSearchRadio(item.filter.list, col.name)};
          break;
        case "checkbox":
          item = {...item, ...getColumnSearchCheckbox(item.filter.list, col.name)};
          break;
        case "date":
          item = {...item, ...getColumnSearchDate(col.name)};
          break;
        default:
          item = {...item, ...getColumnSearchInput(col.name)};
      }
      if (item.filter.value || params.filters[col.name]) {

        filter[col.name] = item.filter.value || params.filters[col.name];
        item = {...item, defaultFilteredValue: item.filter.value || params.filters[col.name]};
      }
      delete item.filter;
    }

    if (item.sorter && params.sort[col.name]) {
      item.defaultSortOrder = params.sort[col.name];
    }

    return {
      title: col.title,
      dataIndex: col.name,
      ...item
    };
  });

  const handleTableChange = (pagination, filters, sorts) => {
    const pageIndex = pagination ? pagination.current : params.pageIndex;
    const pageSize = pagination ? pagination.pageSize : params.pageSize;

    if(!pagination) { delete params.filters.fullTextSearch; }

    const sort = (sorts && sorts.field && sorts.order)
      ? { [sorts.field]: sorts.order}
      : params.sort;
    if (filters.hasOwnProperty('fullTextSearch')) {
      if (filters.fullTextSearch) {
        filter.fullTextSearch = filters.fullTextSearch;
      } else if (filter.hasOwnProperty('fullTextSearch')){
        delete filter.fullTextSearch;
      }
    }
    filters = JSON.stringify(filter);
    history.push({
      pathname: history.location.pathname,
      search: stringify({pageIndex, pageSize, sort: JSON.stringify(sort), filters: JSON.stringify(filters)}),
    });
    onChange && onChange({page: pageIndex, per_page: pageSize, sorts: sort, filters});
  };
  return (
    <div className="datatable_component">
      <Row className="mb-24" justify="space-between">
        {leftHeader && (
          <div>
            {leftHeader}
          </div>
        )}
        {save && (
          <Input.Search
            placeholder={t(langPrefix + '.pleaseEnterValueToSearch')}
            allowClear
            defaultValue={params.filters.fullTextSearch}
            onSearch={(e) => handleTableChange(null, {fullTextSearch: e}, null)}
            style={{width: 250}}
          />
        )}
        {rightHeader && (
          <div>
            {rightHeader}
          </div>
        )}
      </Row>
      <Table
        loading={loading}
        columns={cols}
        pagination={save ? {total, current: +params.pageIndex} : {total}}
        dataSource={dataSource.map((item, index) => ({...item, key: index}))}
        onChange={save && handleTableChange}
        showSorterTooltip={false}
        size="small"
      />
    </div>
  );
};
