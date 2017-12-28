import * as React from 'react'
import { Form } from 'antd'

export default class FormItem extends React.Component<{}> {
  render() {
    return (
      <Form.Item
        labelCol={{
          xs: { span: 24 },
          sm: { span: 24 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 24 }
        }}
      // validateStatus="error"
      // hasFeedback
      >
        {
          this.props.children
        }
      </Form.Item>
    )
  }
}