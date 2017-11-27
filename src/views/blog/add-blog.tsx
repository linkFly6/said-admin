import * as React from 'react'
// import SaidEditor from '../../components/said-editor'
import { Button, Form, Input, Row, Col, AutoComplete } from 'antd'
import * as antd from 'antd'
import SaidEditor from '../../components/said-editor/editor'
import { FormComponentProps } from 'antd/lib/form/Form'
import * as s from './add-blog.styl'



export interface StateProps { }

const options: any = [
  (
    <AutoComplete.Option key="TypeScript" value="Typescript">
      <a
        href="javascript:;"
        target="_blank"
        rel="noopener noreferrer"
      >
        TypeScript
      </a>
    </AutoComplete.Option>
  )
]

class AddBlog extends React.Component<FormComponentProps & StateProps> {
  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    return (
      <div className={`${s.view} ${s.addBlog}`}>
        <Form layout="vertical">
          <Row>
            <Col span={14}>
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
                  getFieldDecorator(
                    'title',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '请输入文章标题' }],
                    })(
                    <Input style={{ width: '100%' }} placeholder="文章标题" size="large" />
                    )
                }
              </Form.Item>
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
                hasFeedback
              >
                <div className="editor">
                  <SaidEditor />
                </div>
              </Form.Item>
            </Col>
            <Col span={8} offset={2}>
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
                hasFeedback
              >
                {
                  getFieldDecorator(
                    'xxxxx',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '分类xxx' }],
                    })(
                    <Input style={{ width: '100%' }} placeholder="文章标题" size="large" />
                    )
                }
              </Form.Item>


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
                hasFeedback
              >

                {
                  getFieldDecorator(
                    'category',
                    {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{ required: true, message: '请输入分类' }],
                    })(
                    <AutoComplete
                      className="certain-category-search"
                      dropdownClassName="certain-category-search-dropdown"
                      dropdownStyle={{ width: 300 }}
                      size="large"
                      style={{ width: '100%' }}
                      dataSource={options}
                      optionLabelProp="value"
                    >
                      <Input style={{ width: '100%' }} placeholder="文章标题" size="large" />
                    </AutoComplete>
                    )
                }
              </Form.Item>

            </Col>
          </Row>
          <Row>
            <Col span={12} offset={12}>
              <Button loading={false} size="large">
                预览
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()(AddBlog)
