import * as React from 'react'
import * as s from './login.styl'
import { Button, Form, Input } from 'antd'
import { draw } from '../../assets/js/low-poly'
import { FormComponentProps } from 'antd/lib/form/Form'
import { inject, observer } from 'mobx-react'


export interface StateProps {

}

@inject('store')
@observer
class Login extends React.Component<FormComponentProps & StateProps> {
  componentDidMount() {
    const elem = this.refs.container as HTMLDivElement
    draw(elem)
    // mbox 太爽
    setInterval(
      () => {
        (this.props as any).store.common.demo++
      },
      1000)
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
          {(this.props as any).store.common.demo}
          <Form>
            <Form.Item>
              {
                getFieldDecorator(
                  'name',
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{ required: true, message: '请输入用户名' }],
                  })(
                  <Input placeholder="用户名" size="large" onKeyDown={this.handleChange} />
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
                  <Input placeholder="密码" size="large" onKeyDown={this.handleChange} />
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