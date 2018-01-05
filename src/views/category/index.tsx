import * as React from 'react'
import { Button, Row, Col, Table, Icon, Modal, Form, Input, Popconfirm } from 'antd'
import { FormItemProps } from 'antd/lib/form/FormItem'
import SelectCategory from '../../components/select-catogory'
import { CategoryModel } from '../../types/category'
import * as s from './index.styl'
import { Map } from 'immutable'
import { inject, observer } from 'mobx-react'
import { CategoryStore } from '../../store/category'


export interface StateProps {
  category: CategoryStore
}


interface State {
  visible: boolean,
  editModel: {
    icon: string
    name: string
    validateStatus: FormItemProps['validateStatus']
    errMsg: string
  },
  cacheData: Map<string, CategoryModel>
}

@inject((allStores: any) => ({
  category: allStores.store.category
}))
@observer
export default class Index extends React.Component<StateProps, State> {
  columns: (
    { title: string; dataIndex: string; key: string; }
    | { title: string; key: string; render: (text: any, record: any) => JSX.Element; })[]
  /**
   * 大体的编辑思路上就是将编辑项放入 cache 中，然后一直编辑 cache，保存的时候再更新到 store
   * @param props 
   */

  constructor(props: StateProps) {
    super(props)
    this.columns = [
      // {
      //   title: 'ID',
      //   dataIndex: '_id',
      //   key: '_id',
      //   colSpan: 0,
      // }, 
      {
        title: 'Icon',
        dataIndex: 'icon',
        key: 'icon',
        render: (_, category: CategoryModel) => (
          <div>
            {
              <SelectCategory
                icon={
                  process.env.PUBLIC_URL + '' +
                  (this.hasCache(category._id) ? this.getCache(category._id).icon : category.icon)
                }
                disabled={!this.hasCache(category._id)}
                changeIcon={icon => this.handleChangeColumnIcon(icon, category._id)}
              />
            }
          </div>
        )
      }, {
        title: '分类',
        dataIndex: 'name',
        key: 'name',
        render: (text, category: CategoryModel) => {
          if (this.hasCache(category._id)) {
            return (
              <div>
                <Input
                  style={{ margin: '-5px 0' }}
                  value={this.state.cacheData.get(category._id).name}
                  onChange={e => this.handleColumnChange(e.target.value, category._id)}
                />
              </div>
            )
          } else {
            return (<div>{text}</div>)
          }
        },
      }, {
        title: '操作',
        key: 'action',
        render: (_, category: CategoryModel) => (
          <span className={s.tableCellOp}>
            {
              // category.editable ?
              this.hasCache(category._id) ?
                (
                  <span>
                    <Popconfirm title="确定是否保存?" onConfirm={() => this.save(category._id)}>
                      {
                        // onClick={() => this.edit(category, false)}
                      }
                      <Button icon="save" type="primary" />
                    </Popconfirm>
                    <Button icon="close" onClick={() => this.removeCache(category._id)} />
                  </span>) :
                <span>
                  <Button icon="edit" type="primary" onClick={() => this.edit(category)} />
                  <Button icon="delete" type="danger" />
                </span>
            }

          </span>
        )
      }]
  }
  state: State = {
    visible: false,
    editModel: {
      icon: process.env.PUBLIC_URL + '/images/default.png',
      name: '',
      validateStatus: 'success',
      errMsg: '',
    },
    cacheData: Map<string, CategoryModel>()
  }

  // 一些工具函数

  getCache(categoryId: string) {
    return this.state.cacheData.get(categoryId)
  }
  hasCache(categoryId: string) {
    return this.state.cacheData.has(categoryId)
  }
  updateCache(categoryId: string, catetory: { icon?: string, name?: string }) {
    this.setState({
      cacheData: this.state.cacheData.update(
        categoryId,
        item => {
          return Object.assign({}, item, catetory)
        }
      ),
    })
  }

  // 编辑模式
  edit(category: CategoryModel) {
    this.setState({
      cacheData: this.state.cacheData.set(category._id, category)
    })
  }

  // 移除缓存
  removeCache(categoryId: string) {
    this.setState({
      cacheData: this.state.cacheData.remove(categoryId)
    })
  }
  // 保存编辑
  save(categoryId: string) {
    const category = this.state.cacheData.get(categoryId)
    this.removeCache(categoryId)
    this.props.category.edit(category)
  }

  setEditModel = (editModel: {
    icon?: string,
    name?: string,
    validateStatus?: FormItemProps['validateStatus'],
    errMsg?: string
  } = {}) => {
    const state = {
      editModel: {
        ...this.state.editModel,
        ...editModel
      }
    }
    this.setState(state)
    return state
  }


  handleColumnChange(value: string, categoryId: string) {
    this.updateCache(categoryId, { name: value })
  }


  handleChangeColumnIcon(icon: string, categoryId: string) {
    this.updateCache(categoryId, { icon })
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    })
  }

  handleInputChange = (e) => {
    this.clearErrorMsg({
      name: e.target.value
    })
  }


  handleChangeIcon = (icon: string) => {
    this.setEditModel({
      icon,
    })
  }

  validateAddCategory = () => {
    if (!this.state.editModel.name) {
      this.setState({
        editModel: {
          ...this.state.editModel,
          ...{
            validateStatus: 'error',
            errMsg: '请输入分类名称',
          }
        }
      })
      return false
    }
    this.clearErrorMsg()
    return true
  }

  clearErrorMsg = (editModel = {}) => {
    return this.setEditModel({
      ...{
        validateStatus: 'success',
        errMsg: '',
      },
      ...editModel
    })
  }

  handleAddCategory = () => {
    if (!this.validateAddCategory()) return
    this.props.category.add({
      _id: Math.random().toString(),
      name: this.state.editModel.name,
      icon: this.state.editModel.icon,
    })
  }

  render() {
    return (
      <div className={`${s.view} ${s.category}`}>
        <Row className={s.tableOperations} type="flex" align="middle">
          <Col span={4}>
            <Row gutter={12}>
              <Col span={16}>
                <Form.Item
                  validateStatus={this.state.editModel.validateStatus}
                  help={this.state.editModel.errMsg}
                >
                  {
                    <Input
                      prefix={
                        <SelectCategory
                          icon={this.state.editModel.icon}
                          changeIcon={this.handleChangeIcon}
                        />
                      }
                      value={this.state.editModel.name}
                      maxLength="12"
                      className={s.prefixInput}
                      placeholder="分类名称"
                      onChange={this.handleInputChange}
                      size="large"
                      autoComplete="off"
                    />
                  }
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button size="large" icon="plus" type="primary" onClick={this.handleAddCategory}>新增</Button>
              </Col>
            </Row>

          </Col>
          <Col span={8} offset={8} />
        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowKey="_id"
              columns={this.columns}
              // 因为 mbox 将 array 进行包装(模拟 array)，所以如果使用 Array.isArray 判断肯定是 false，所以可以将它转换成真正的数组
              dataSource={this.props.category.categorys.slice()}
              bordered={true}
            />
          </Col>
        </Row>
      </div >
    )
  }
}

