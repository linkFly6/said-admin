import * as React from 'react'
import { Spin } from 'antd'

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