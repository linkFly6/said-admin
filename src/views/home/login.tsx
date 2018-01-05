import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { actions, DispatchProps } from '../../ducks/dashboard-duck'
import { LogFileModel } from '../../types/dashboard'
import * as s from './login.styl'
import { Dispatch } from 'redux'
import { Button, Form, Input } from 'antd'
import { draw } from '../../assets/js/low-poly'
import { FormComponentProps } from 'antd/lib/form/Form'


export interface StateProps {

}

// @connnet 的 *.d.ts 是 ts2.4 的，项目用的 ts2.6，mmp 2.6 对参数做了强校验
// @connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)
class Login extends React.Component<FormComponentProps & StateProps> {
  componentDidMount() {
    const elem = this.refs.container as HTMLDivElement
    draw(elem)
  }

  handleChange = (e: React.KeyboardEvent<any>) => {
    if (e.keyCode === 13) {
      this.handleSubmit()
    }
  }

  handleSubmit = () => {
    this.props.form.validateFields((err, value: { name: string, password: string }) => {
      if (err) {
        return
      }
    })
  }
  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className={`${s.view} ${s.login}`}>
        <div ref="container" className={s.container} />
        <div className={s.loginConteainer}>
          <div className={s.logo} />
          <Form>
            <Form.Item>
              {
                getFieldDecorator(
                  'name',
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: '请输入用户名' }],
                  })(
                  <Input placeholder="用户名" size="large" onKeyDown={this.handleChange}/>
                  )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator(
                  'password',
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: '请输入密码' }],
                  })(
                  <Input placeholder="密码" size="large" onKeyDown={this.handleChange}/>
                  )
              }
            </Form.Item>
            <Form.Item className={s.center}>
              <Button type="primary" size="large" onClick={this.handleSubmit}>进入</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(Login)