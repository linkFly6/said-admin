import * as React from 'react'
import { Spin, Form } from 'antd'
import { FormItemProps } from 'antd/lib/form'


/**
 * 工厂函数
 * 根据默认配置创建一个 Form.Item 的表单项函数，这些 Form.Item 都拥有同样的默认配置
 * 用于整个页面表单风格的统一
 * @param factoryProps 
 */
export const createFormItem = (factoryProps: FormItemProps) => {
  return (props: Readonly<{ children?: React.ReactNode }> & FormItemProps) => {
    const p = { ...factoryProps, ...props }
    return (
      <Form.Item {...p}>
        {
          props.children
        }
      </Form.Item>
    )
  }
}



/**
 * 每个页面通用的页面级 loading
 * 页面加载数据的时候可以使用这个 loading 组件从而保持页面风格一致
 */
export const PageLoading = () => {
  return (
    // 样式在 App.styl 里
    <div className="page-loading">
      <Spin size="large" />
    </div>
  )
}

