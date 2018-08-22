import * as React from 'react'
import * as s from './login.styl'
import { Button, Form, Input, message } from 'antd'
import { draw } from '../../assets/js/low-poly'
import { FormComponentProps } from 'antd/lib/form/Form'
import { inject, observer } from 'mobx-react'
import { AdminStore } from '../../store/admin'
import history from '../../assets/js/history'
import { withRouter as fuckWithRouterTSD, RouteComponentProps } from 'react-router-dom'
import { deserializeUrl } from '../../service/utils'

const withRouter = fuckWithRouterTSD as any

export interface StateProps {
  admin: AdminStore
}


@inject((allStores: any) => ({
  admin: allStores.store.admin
}))
@observer
@withRouter
class Login extends React.Component<FormComponentProps & RouteComponentProps<{}> & StateProps> {
  // class Login extends PageComponent<FormComponentProps & StateProps> {

  state = {
    loading: false
  }

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
    // this.props.history.push({
    //   pathname: '/abldjal',
    //   search: 'src=/login'
    // })
    this.setState({
      loading: true
    })
    this.props.form.validateFields(async (err, field: { username: string, password: string }) => {
      if (err) {
        this.setState({
          loading: false
        })
        return
      }
      const returns = await this.props.admin.login(field.username, field.password)
      this.setState({
        loading: false
      })
      if (!returns.check()) {
        message.error(returns.message)
        return
      }
      // 跳转
      const serach = deserializeUrl<{ src: string }>(this.props.location.search)
      if (serach.src) {
        this.props.history.replace(serach.src)
      } else {
        this.props.history.replace('/')
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
                  'username',
                  {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      { required: true, message: '请输入用户名', },
                      { min: 0, max: 40, message: '用户名长度不正确' },
                    ],
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
                    rules: [
                      { required: true, message: '请输入密码' },
                      { min: 0, max: 30, message: '用户长度不正确' },
                    ],
                  })(
                  <Input type="password" placeholder="密码" size="large" onKeyDown={this.handleChange} />
                  )
              }
            </Form.Item>
            <Form.Item className={s.center}>
              <Button
                type="primary"
                size="large"
                onClick={this.handleSubmit}
                loading={this.state.loading}
              >
                进入
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(Login)