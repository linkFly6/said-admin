import * as React from 'react'
import { DispatchProp } from 'react-redux'
import { Button, Row, Col, Table, Icon, Modal, Form, Input, Popconfirm } from 'antd'
import { FormItemProps } from 'antd/lib/form/FormItem'
import SelectCategory from '../../components/select-catogory'
import { CategoryModel } from '../../types/category'
import * as s from './index.styl'
import * as duckCategory from '../../ducks/category-duck'


type Category = { editable?: boolean } & CategoryModel


export interface StateProps {
  categorys: CategoryModel[],
}


interface State {
  visible: boolean,
  editModel: {
    icon: string
    name: string
    validateStatus: FormItemProps['validateStatus']
    errMsg: string
  },
  cacheData: Category[]
}

class Index extends React.Component<StateProps & DispatchProp<duckCategory.DispatchProps>, State> {
  columns: (
    { title: string; dataIndex: string; key: string; }
    | { title: string; key: string; render: (text: any, record: any) => JSX.Element; })[]

  constructor(props: StateProps & DispatchProp<duckCategory.DispatchProps>) {
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
        // (_, record: Category) => this.renderColumns(_, record, 'name')
        render: (_, category: Category) => (
          <div>
            {
              <SelectCategory
                icon={process.env.PUBLIC_URL + category.icon}
                changeIcon={icon => this.handleChangeColumnIcon(icon, category._id)}
              />
            }
          </div>
        )
      }, {
        title: '分类',
        dataIndex: 'name',
        key: 'name',
        render: (text, category: Category) => (
          <div>
            {category.editable
              ? <Input
                style={{ margin: '-5px 0' }}
                value={text}
                onChange={e => this.handleColumnChange(e.target.value, category._id)}
              />
              : text
            }
          </div>
        )
      }, {
        title: '操作',
        key: 'action',
        render: (_, category: Category) => (
          <span className={s.tableCellOp}>
            {
              category.editable ?
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
                <Button icon="edit" type="primary" onClick={() => this.edit(category, true)} />
            }
            <Button icon="delete" type="danger" />
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
    cacheData: []
  }

  // 编辑项
  edit(category: Category, editable: boolean) {
    const cate = this.props.categorys.find(item => item._id === category._id)
    if (cate && this.props.dispatch) {
      // (cate as Category).editable = true
      if (editable) {
        (cate as Category).editable = true
      } else {
        delete (cate as Category).editable
        this.removeCache(cate._id)
      }
      this.props.dispatch(duckCategory.actions.edit(category._id, cate))
    }
  }

  // 取消编辑
  chancel(id: string) {
    const category = this.removeCache(id)
    const cate = this.props.categorys.find(item => item._id === id)
    if (cate && this.props.dispatch) {
      delete (cate as Category).editable
      this.props.dispatch(duckCategory.actions.edit(id, cate))
    }
  }

  // 移除缓存
  removeCache(id: string) {
    const cacheDataIndex = this.state.cacheData.findIndex(item => item._id === id)
    if (~cacheDataIndex) {
      const newData = [...this.state.cacheData]
      const category = newData.splice(cacheDataIndex, 1)
      this.setState({
        cacheData: newData
      })
      return category[0]
    }
    return null
  }

  // 保存编辑
  save(id: string) {
    const cate = this.props.categorys.find(item => item._id === id)
    if (cate && this.props.dispatch) {
      const category = { ...cate } as Category
      Object.assign(category, this.state.cacheData.find(item => id === item._id))
      this.removeCache(id)
      this.props.dispatch(duckCategory.actions.edit(id, cate))
    }
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




  handleColumnChange(value: string, id: string) {
    // const category =  this.props.categorys.find()
    const newData = [...this.state.cacheData]
    const cate = newData.find(item => item._id === id)
    if (cate) {
      cate.name = value
      this.setState({
        cacheData: newData,
      })
    }
  }


  handleChangeColumnIcon(icon: string, id: string) {
    const newData = [...this.state.cacheData]
    const cate = newData.find(item => item._id === id)
    if (cate) {
      cate.icon = icon
      this.setState({
        cacheData: newData,
      })
    }
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
    if (this.props.dispatch) {
      this.props.dispatch(duckCategory.actions.add({
        _id: Math.random().toString(),
        name: this.state.editModel.name,
        icon: this.state.editModel.icon,
      }))
    }
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
              dataSource={this.props.categorys}
              bordered={true}
            />
          </Col>
        </Row>
      </div >
    )
  }
}

export default Index
