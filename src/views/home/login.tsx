import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { actions, DispatchProps } from '../../ducks/dashboard-duck'
import { LogFileModel } from '../../types/dashboard'
import * as s from './login.styl'
import { Dispatch } from 'redux'
import { Button, Form, Input } from 'antd'
// import { draw } from '../../assets/js/low-poly2'
import { draw } from '../../assets/js/low-poly'



export interface StateProps {
}

class LowPoly extends React.Component<{}> {
  componentDidMount() {
    const elem = this.refs.container as HTMLDivElement
    draw(elem)
  }
  render() {
    return (
      <div className={`${s.view} ${s.login}`}>
        <div ref="container" className={s.container} />
        <div className={s.loginConteainer}>
          <Form>
            <Form.Item>
              <Input placeholder="用户名" size="large" />
            </Form.Item>
            <Form.Item>
              <Input placeholder="密码" type="password" size="large" />
            </Form.Item>
            <Form.Item className={s.center}>
              <Button type="primary" size="large">进入</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}


// @connnet 的 *.d.ts 是 ts2.4 的，项目用的 ts2.6，mmp 2.6 对参数做了强校验
// @connect<StateProps, DispatchProps, any>(mapStateToProps, mapDispatchToProps)
export default class extends React.Component<StateProps & DispatchProps> {
  render() {
    return (
      <div>
        <LowPoly />
      </div>
    )
  }
}