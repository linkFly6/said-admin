import * as React from 'react'
import { DispatchProp } from 'react-redux'
import { Button, Row, Col, Table, Icon, Modal, Form, Input } from 'antd'
import { FormItemProps } from 'antd/lib/form/FormItem'
import SelectCategory from '../../components/select-catogory'
import { CategoryModel } from '../../types/category'
import * as s from './index.styl'
import * as duckCategory from '../../ducks/category-duck'


const columns = [
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
  }, {
    title: '分类',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <Icon type="edit" />
        <Icon type="delete" />
      </span>
    )
  }]

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
  }
}

class Index extends React.Component<StateProps & DispatchProp<duckCategory.DispatchProps>, State> {

  state: State = {
    visible: false,
    editModel: {
      icon: process.env.PUBLIC_URL + '/images/default.png',
      name: '',
      validateStatus: 'success',
      errMsg: '',
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
  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e) => {
    console.log(e)
    this.setState({
      visible: false
    })
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
                <Button size="large" type="primary" onClick={this.handleAddCategory}>新增</Button>
              </Col>
            </Row>

          </Col>
          <Col span={8} offset={8} />
        </Row>
        <Row>
          <Col span={24}>
            <Table
              columns={columns}
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
